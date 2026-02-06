import { useState, useCallback } from 'react'
import { Play, RotateCcw } from 'lucide-react'
import { FunctionExample, CellData } from '../types'
import clsx from 'clsx'

interface InteractiveDemoProps {
  example: FunctionExample
}

// 公式计算器
function evaluateFormula(formula: string, data: CellData[][]): string {
  try {
    // 获取单元格值
    const getCellValue = (ref: string): string | number => {
      const match = ref.match(/([A-Z])(\d+)/i)
      if (!match) return ''
      const col = match[1].toUpperCase().charCodeAt(0) - 65
      const row = parseInt(match[2]) - 1
      if (data[row] && data[row][col]) {
        return data[row][col].value
      }
      return ''
    }

    // 获取范围值（一维数组）
    const getRangeValues = (range: string): (string | number)[] => {
      const match = range.match(/([A-Z])(\d+):([A-Z])(\d+)/i)
      if (!match) return []
      const startCol = match[1].toUpperCase().charCodeAt(0) - 65
      const startRow = parseInt(match[2]) - 1
      const endCol = match[3].toUpperCase().charCodeAt(0) - 65
      const endRow = parseInt(match[4]) - 1
      
      const values: (string | number)[] = []
      for (let r = startRow; r <= endRow; r++) {
        for (let c = startCol; c <= endCol; c++) {
          if (data[r] && data[r][c]) {
            values.push(data[r][c].value)
          }
        }
      }
      return values
    }

    // 获取范围为二维数组
    const getRangeAs2D = (range: string): (string | number)[][] => {
      const match = range.match(/([A-Z])(\d+):([A-Z])(\d+)/i)
      if (!match) return []
      const startCol = match[1].toUpperCase().charCodeAt(0) - 65
      const startRow = parseInt(match[2]) - 1
      const endCol = match[3].toUpperCase().charCodeAt(0) - 65
      const endRow = parseInt(match[4]) - 1
      
      const result: (string | number)[][] = []
      for (let r = startRow; r <= endRow; r++) {
        const row: (string | number)[] = []
        for (let c = startCol; c <= endCol; c++) {
          if (data[r] && data[r][c]) {
            row.push(data[r][c].value)
          } else {
            row.push('')
          }
        }
        result.push(row)
      }
      return result
    }

    // 获取单列范围
    const getColumnValues = (range: string): (string | number)[] => {
      const match = range.match(/([A-Z])(\d+):([A-Z])(\d+)/i)
      if (!match) return []
      const col = match[1].toUpperCase().charCodeAt(0) - 65
      const startRow = parseInt(match[2]) - 1
      const endRow = parseInt(match[4]) - 1
      
      const values: (string | number)[] = []
      for (let r = startRow; r <= endRow; r++) {
        if (data[r] && data[r][col]) {
          values.push(data[r][col].value)
        } else {
          values.push('')
        }
      }
      return values
    }

    const formulaUpper = formula.toUpperCase().replace('=', '')

    // SUM
    if (formulaUpper.startsWith('SUM(')) {
      const rangeMatch = formulaUpper.match(/SUM\(([A-Z]\d+:[A-Z]\d+)\)/i)
      if (rangeMatch) {
        const values = getRangeValues(rangeMatch[1])
        const sum = values.reduce((acc: number, val) => acc + (typeof val === 'number' ? val : parseFloat(val as string) || 0), 0)
        return sum.toString()
      }
    }

    // AVERAGE
    if (formulaUpper.startsWith('AVERAGE(')) {
      const rangeMatch = formulaUpper.match(/AVERAGE\(([A-Z]\d+:[A-Z]\d+)\)/i)
      if (rangeMatch) {
        const values = getRangeValues(rangeMatch[1])
        const nums = values.filter(v => typeof v === 'number' || !isNaN(parseFloat(v as string)))
        const sum = nums.reduce((acc: number, val) => acc + (typeof val === 'number' ? val : parseFloat(val as string)), 0)
        return (sum / nums.length).toString()
      }
    }

    // MAX
    if (formulaUpper.startsWith('MAX(')) {
      const rangeMatch = formulaUpper.match(/MAX\(([A-Z]\d+:[A-Z]\d+)\)/i)
      if (rangeMatch) {
        const values = getRangeValues(rangeMatch[1])
        const nums = values.map(v => typeof v === 'number' ? v : parseFloat(v as string)).filter(n => !isNaN(n))
        return Math.max(...nums).toString()
      }
    }

    // MIN
    if (formulaUpper.startsWith('MIN(')) {
      const rangeMatch = formulaUpper.match(/MIN\(([A-Z]\d+:[A-Z]\d+)\)/i)
      if (rangeMatch) {
        const values = getRangeValues(rangeMatch[1])
        const nums = values.map(v => typeof v === 'number' ? v : parseFloat(v as string)).filter(n => !isNaN(n))
        return Math.min(...nums).toString()
      }
    }

    // COUNT
    if (formulaUpper.startsWith('COUNT(')) {
      const rangeMatch = formulaUpper.match(/COUNT\(([A-Z]\d+:[A-Z]\d+)\)/i)
      if (rangeMatch) {
        const values = getRangeValues(rangeMatch[1])
        const count = values.filter(v => typeof v === 'number' || (typeof v === 'string' && !isNaN(parseFloat(v)) && v !== '')).length
        return count.toString()
      }
    }

    // CONCAT
    if (formulaUpper.startsWith('CONCAT(')) {
      const argsMatch = formula.match(/CONCAT\((.+)\)/i)
      if (argsMatch) {
        const args = argsMatch[1].split(',').map(arg => {
          arg = arg.trim()
          if (arg.startsWith('"') && arg.endsWith('"')) {
            return arg.slice(1, -1)
          }
          return getCellValue(arg)
        })
        return args.join('')
      }
    }

    // LEFT
    if (formulaUpper.startsWith('LEFT(')) {
      const match = formula.match(/LEFT\(([A-Z]\d+),\s*(\d+)\)/i)
      if (match) {
        const value = String(getCellValue(match[1]))
        const num = parseInt(match[2])
        return value.substring(0, num)
      }
    }

    // RIGHT
    if (formulaUpper.startsWith('RIGHT(')) {
      const match = formula.match(/RIGHT\(([A-Z]\d+),\s*(\d+)\)/i)
      if (match) {
        const value = String(getCellValue(match[1]))
        const num = parseInt(match[2])
        return value.substring(value.length - num)
      }
    }

    // MID
    if (formulaUpper.startsWith('MID(')) {
      const match = formula.match(/MID\(([A-Z]\d+),\s*(\d+),\s*(\d+)\)/i)
      if (match) {
        const value = String(getCellValue(match[1]))
        const start = parseInt(match[2]) - 1
        const num = parseInt(match[3])
        return value.substring(start, start + num)
      }
    }

    // LEN
    if (formulaUpper.startsWith('LEN(')) {
      const match = formula.match(/LEN\(([A-Z]\d+)\)/i)
      if (match) {
        const value = String(getCellValue(match[1]))
        return value.length.toString()
      }
    }

    // UPPER
    if (formulaUpper.startsWith('UPPER(')) {
      const match = formula.match(/UPPER\(([A-Z]\d+)\)/i)
      if (match) {
        const value = String(getCellValue(match[1]))
        return value.toUpperCase()
      }
    }

    // LOWER
    if (formulaUpper.startsWith('LOWER(')) {
      const match = formula.match(/LOWER\(([A-Z]\d+)\)/i)
      if (match) {
        const value = String(getCellValue(match[1]))
        return value.toLowerCase()
      }
    }

    // TRIM
    if (formulaUpper.startsWith('TRIM(')) {
      const match = formula.match(/TRIM\(([A-Z]\d+)\)/i)
      if (match) {
        const value = String(getCellValue(match[1]))
        return value.trim().replace(/\s+/g, ' ')
      }
    }

    // ABS
    if (formulaUpper.startsWith('ABS(')) {
      const match = formula.match(/ABS\(([A-Z]\d+)\)/i)
      if (match) {
        const value = parseFloat(String(getCellValue(match[1])))
        return Math.abs(value).toString()
      }
    }

    // ROUND
    if (formulaUpper.startsWith('ROUND(')) {
      const match = formula.match(/ROUND\(([A-Z]\d+),\s*(\d+)\)/i)
      if (match) {
        const value = parseFloat(String(getCellValue(match[1])))
        const digits = parseInt(match[2])
        return value.toFixed(digits)
      }
    }

    // YEAR
    if (formulaUpper.startsWith('YEAR(')) {
      const match = formula.match(/YEAR\(([A-Z]\d+)\)/i)
      if (match) {
        const value = String(getCellValue(match[1]))
        const date = new Date(value)
        return date.getFullYear().toString()
      }
    }

    // MONTH
    if (formulaUpper.startsWith('MONTH(')) {
      const match = formula.match(/MONTH\(([A-Z]\d+)\)/i)
      if (match) {
        const value = String(getCellValue(match[1]))
        const date = new Date(value)
        return (date.getMonth() + 1).toString()
      }
    }

    // DAY
    if (formulaUpper.startsWith('DAY(')) {
      const match = formula.match(/DAY\(([A-Z]\d+)\)/i)
      if (match) {
        const value = String(getCellValue(match[1]))
        const date = new Date(value)
        return date.getDate().toString()
      }
    }

    // TODAY
    if (formulaUpper.startsWith('TODAY(')) {
      const today = new Date()
      return today.toISOString().split('T')[0]
    }

    // DATEDIF
    if (formulaUpper.startsWith('DATEDIF(')) {
      const match = formula.match(/DATEDIF\(([A-Z]\d+),\s*([A-Z]\d+),\s*"([YMD])"\)/i)
      if (match) {
        const startDate = new Date(String(getCellValue(match[1])))
        const endDate = new Date(String(getCellValue(match[2])))
        const unit = match[3].toUpperCase()
        
        const diffTime = endDate.getTime() - startDate.getTime()
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
        
        if (unit === 'D') return diffDays.toString()
        if (unit === 'M') return Math.floor(diffDays / 30).toString()
        if (unit === 'Y') return Math.floor(diffDays / 365).toString()
      }
    }

    // IF
    if (formulaUpper.startsWith('IF(')) {
      const match = formula.match(/IF\(([A-Z]\d+)\s*(>=|<=|>|<|=)\s*(\d+),\s*"([^"]*)",\s*"([^"]*)"\)/i)
      if (match) {
        const cellVal = Number(getCellValue(match[1]))
        const operator = match[2]
        const compareVal = Number(match[3])
        const trueVal = match[4]
        const falseVal = match[5]
        
        let result = false
        switch (operator) {
          case '>=': result = cellVal >= compareVal; break
          case '<=': result = cellVal <= compareVal; break
          case '>': result = cellVal > compareVal; break
          case '<': result = cellVal < compareVal; break
          case '=': result = cellVal === compareVal; break
        }
        return result ? trueVal : falseVal
      }
    }

    // AND
    if (formulaUpper.startsWith('AND(')) {
      const match = formula.match(/AND\(([A-Z]\d+)\s*(>|<|>=|<=|=)\s*(\d+),\s*([A-Z]\d+)\s*(>|<|>=|<=|=)\s*(\d+)\)/i)
      if (match) {
        const val1 = Number(getCellValue(match[1]))
        const op1 = match[2]
        const cmp1 = Number(match[3])
        const val2 = Number(getCellValue(match[4]))
        const op2 = match[5]
        const cmp2 = Number(match[6])
        
        const evalOp = (v: number, op: string, c: number): boolean => {
          switch (op) {
            case '>=': return v >= c
            case '<=': return v <= c
            case '>': return v > c
            case '<': return v < c
            case '=': return v === c
            default: return false
          }
        }
        
        return (evalOp(val1, op1, cmp1) && evalOp(val2, op2, cmp2)) ? 'TRUE' : 'FALSE'
      }
    }

    // OR
    if (formulaUpper.startsWith('OR(')) {
      const match = formula.match(/OR\(([A-Z]\d+)\s*=\s*"([^"]*)",\s*([A-Z]\d+)\s*=\s*"([^"]*)"\)/i)
      if (match) {
        const val1 = String(getCellValue(match[1]))
        const cmp1 = match[2]
        const val2 = String(getCellValue(match[3]))
        const cmp2 = match[4]
        return (val1 === cmp1 || val2 === cmp2) ? 'TRUE' : 'FALSE'
      }
    }

    // IFERROR
    if (formulaUpper.startsWith('IFERROR(')) {
      const match = formula.match(/IFERROR\(([A-Z]\d+)\/([A-Z]\d+),\s*"([^"]*)"\)/i)
      if (match) {
        const val1 = Number(getCellValue(match[1]))
        const val2 = Number(getCellValue(match[2]))
        const errorVal = match[3]
        if (val2 === 0 || isNaN(val1) || isNaN(val2)) {
          return errorVal
        }
        return (val1 / val2).toString()
      }
    }

    // INDEX - 返回指定位置的值
    if (formulaUpper.startsWith('INDEX(')) {
      const match = formula.match(/INDEX\(\s*([A-Z]\d+:[A-Z]\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)/i)
      if (match) {
        const range2D = getRangeAs2D(match[1])
        const rowNum = parseInt(match[2]) - 1
        const colNum = parseInt(match[3]) - 1
        if (range2D[rowNum] && range2D[rowNum][colNum] !== undefined) {
          return String(range2D[rowNum][colNum])
        }
        return '#REF!'
      }
    }

    // MATCH - 返回值在范围中的位置
    if (formulaUpper.startsWith('MATCH(')) {
      const match = formula.match(/MATCH\(\s*"([^"]*)"\s*,\s*([A-Z]\d+:[A-Z]\d+)\s*,\s*(\d+)\s*\)/i)
      if (match) {
        const lookupValue = match[1]
        const values = getColumnValues(match[2])
        const matchType = parseInt(match[3])
        
        if (matchType === 0) {
          // 精确匹配
          const index = values.findIndex(v => String(v) === lookupValue)
          if (index !== -1) {
            return (index + 1).toString()
          }
        }
        return '#N/A'
      }
    }

    // VLOOKUP - 垂直查找
    if (formulaUpper.startsWith('VLOOKUP(')) {
      const match = formula.match(/VLOOKUP\(([A-Z]\d+),\s*([A-Z]\d+:[A-Z]\d+),\s*(\d+),\s*(TRUE|FALSE)\)/i)
      if (match) {
        const lookupValue = String(getCellValue(match[1]))
        const range2D = getRangeAs2D(match[2])
        const colIndex = parseInt(match[3]) - 1
        const exactMatch = match[4].toUpperCase() === 'FALSE'
        
        for (let i = 0; i < range2D.length; i++) {
          const firstColValue = String(range2D[i][0])
          if (exactMatch) {
            if (firstColValue === lookupValue) {
              if (range2D[i][colIndex] !== undefined) {
                return String(range2D[i][colIndex])
              }
            }
          } else {
            // 近似匹配（简化实现）
            if (firstColValue === lookupValue) {
              if (range2D[i][colIndex] !== undefined) {
                return String(range2D[i][colIndex])
              }
            }
          }
        }
        return '#N/A'
      }
    }

    // HLOOKUP - 水平查找
    if (formulaUpper.startsWith('HLOOKUP(')) {
      const match = formula.match(/HLOOKUP\(([A-Z]\d+),\s*([A-Z]\d+:[A-Z]\d+),\s*(\d+),\s*(TRUE|FALSE)\)/i)
      if (match) {
        const lookupValue = String(getCellValue(match[1]))
        const range2D = getRangeAs2D(match[2])
        const rowIndex = parseInt(match[3]) - 1
        const exactMatch = match[4].toUpperCase() === 'FALSE'
        
        if (range2D.length > 0) {
          const firstRow = range2D[0]
          for (let i = 0; i < firstRow.length; i++) {
            const firstRowValue = String(firstRow[i])
            if (exactMatch) {
              if (firstRowValue === lookupValue) {
                if (range2D[rowIndex] && range2D[rowIndex][i] !== undefined) {
                  return String(range2D[rowIndex][i])
                }
              }
            }
          }
        }
        return '#N/A'
      }
    }

    return '计算结果'
  } catch {
    return '#ERROR'
  }
}

export default function InteractiveDemo({ example }: InteractiveDemoProps) {
  const [cellData, setCellData] = useState<CellData[][]>(
    JSON.parse(JSON.stringify(example.inputData))
  )
  const [result, setResult] = useState<string>('')
  const [isCalculated, setIsCalculated] = useState(false)

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...cellData]
    if (!newData[rowIndex]) {
      newData[rowIndex] = []
    }
    newData[rowIndex][colIndex] = {
      ...newData[rowIndex][colIndex],
      value: isNaN(Number(value)) ? value : Number(value),
    }
    setCellData(newData)
    setIsCalculated(false)
  }

  const handleCalculate = useCallback(() => {
    let formulaCell: CellData | null = null
    cellData.forEach(row => {
      row.forEach(cell => {
        if (cell.formula) {
          formulaCell = cell
        }
      })
    })

    if (formulaCell && (formulaCell as CellData).formula) {
      const calculatedResult = evaluateFormula((formulaCell as CellData).formula!, cellData)
      setResult(calculatedResult)
      setIsCalculated(true)
    }
  }, [cellData])

  const handleReset = () => {
    setCellData(JSON.parse(JSON.stringify(example.inputData)))
    setResult('')
    setIsCalculated(false)
  }

  const columnLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']
  const maxCols = Math.max(...cellData.map(row => row.length), 1)

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-sm font-medium text-gray-700">交互式演示</h4>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-gray-600 
                       bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
            重置
          </button>
          <button
            onClick={handleCalculate}
            className="flex items-center gap-1 px-3 py-1.5 text-sm text-white 
                       bg-primary rounded-lg hover:bg-primary-light transition-colors"
          >
            <Play className="w-4 h-4" />
            计算
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
          <thead>
            <tr>
              <th className="spreadsheet-cell spreadsheet-header w-10"></th>
              {Array.from({ length: maxCols }).map((_, i) => (
                <th key={i} className="spreadsheet-cell spreadsheet-header">
                  {columnLabels[i]}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {cellData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="spreadsheet-cell spreadsheet-row-header">
                  {rowIndex + 1}
                </td>
                {Array.from({ length: maxCols }).map((_, colIndex) => {
                  const cell = row[colIndex]
                  const isResultCell = cell?.isResult
                  const hasFormula = cell?.formula

                  return (
                    <td
                      key={colIndex}
                      className={clsx(
                        'spreadsheet-cell p-0',
                        isResultCell && isCalculated && 'bg-green-50 border-green-300'
                      )}
                    >
                      {isResultCell ? (
                        <div className="px-2 py-1">
                          <span className={clsx(
                            'font-semibold',
                            isCalculated ? 'text-green-700' : 'text-gray-400'
                          )}>
                            {isCalculated ? result : '?'}
                          </span>
                          {hasFormula && (
                            <div className="text-xs text-gray-400 font-mono mt-0.5">
                              {cell.formula}
                            </div>
                          )}
                        </div>
                      ) : (
                        <input
                          type="text"
                          value={cell?.value ?? ''}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          className="w-full h-full px-2 py-1 border-0 focus:outline-none 
                                     focus:ring-2 focus:ring-primary/20 text-sm"
                        />
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
        <p className="text-sm text-gray-600">
          <span className="font-medium text-gray-800">公式：</span>
          <code className="ml-2 px-2 py-0.5 bg-primary/5 text-primary rounded font-mono">
            {example.formula}
          </code>
        </p>
        <p className="text-sm text-gray-500 mt-2">
          {example.description}
        </p>
        {isCalculated && (
          <p className="text-sm mt-2">
            <span className="font-medium text-gray-800">计算结果：</span>
            <span className="ml-2 text-green-600 font-semibold">{result}</span>
            <span className="ml-2 text-gray-400">
              (预期: {example.expectedResult})
            </span>
          </p>
        )}
      </div>
    </div>
  )
}
