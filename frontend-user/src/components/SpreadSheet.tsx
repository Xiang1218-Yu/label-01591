import { CellData } from '../types'
import clsx from 'clsx'

interface SpreadSheetProps {
  data: CellData[][]
  highlightResult?: boolean
}

const columnLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H']

export default function SpreadSheet({ data, highlightResult = true }: SpreadSheetProps) {
  const maxCols = Math.max(...data.map(row => row.length), 1)

  return (
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
          {data.map((row, rowIndex) => (
            <tr key={rowIndex}>
              <td className="spreadsheet-cell spreadsheet-row-header">
                {rowIndex + 1}
              </td>
              {Array.from({ length: maxCols }).map((_, colIndex) => {
                const cell = row[colIndex]
                const isResult = cell?.isResult && highlightResult
                const hasFormula = cell?.formula

                return (
                  <td
                    key={colIndex}
                    className={clsx(
                      'spreadsheet-cell',
                      isResult && 'bg-green-50 border-green-300 font-semibold text-green-700',
                      hasFormula && !isResult && 'bg-blue-50'
                    )}
                  >
                    {cell ? (
                      <div className="flex flex-col">
                        <span>{cell.value}</span>
                        {hasFormula && (
                          <span className="text-xs text-gray-400 font-mono">
                            {cell.formula}
                          </span>
                        )}
                      </div>
                    ) : null}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
