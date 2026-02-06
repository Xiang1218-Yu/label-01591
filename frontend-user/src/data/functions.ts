import { ExcelFunction } from '../types'

export const excelFunctions: ExcelFunction[] = [
  // 文本函数
  {
    id: 'concat',
    name: 'CONCAT',
    categoryId: 'text',
    syntax: 'CONCAT(text1, [text2], ...)',
    description: '将多个文本字符串合并为一个字符串',
    returnType: '文本',
    parameters: [
      { name: 'text1', description: '第一个要合并的文本', required: true, type: '文本' },
      { name: 'text2', description: '其他要合并的文本（可选）', required: false, type: '文本' },
    ],
    examples: [
      {
        id: 'concat-1',
        formula: '=CONCAT(A1, B1)',
        description: '将A1和B1的内容合并',
        inputData: [
          [{ value: '张' }, { value: '三' }, { value: '', formula: '=CONCAT(A1,B1)', isResult: true }],
        ],
        expectedResult: '张三',
      },
      {
        id: 'concat-2',
        formula: '=CONCAT(A1, " ", B1)',
        description: '用空格连接姓和名',
        inputData: [
          [{ value: 'Hello' }, { value: 'World' }, { value: '', formula: '=CONCAT(A1," ",B1)', isResult: true }],
        ],
        expectedResult: 'Hello World',
      },
    ],
  },
  {
    id: 'left',
    name: 'LEFT',
    categoryId: 'text',
    syntax: 'LEFT(text, [num_chars])',
    description: '从文本字符串的左侧返回指定数量的字符',
    returnType: '文本',
    parameters: [
      { name: 'text', description: '要提取字符的文本', required: true, type: '文本' },
      { name: 'num_chars', description: '要提取的字符数，默认为1', required: false, type: '数字' },
    ],
    examples: [
      {
        id: 'left-1',
        formula: '=LEFT(A1, 3)',
        description: '提取前3个字符',
        inputData: [
          [{ value: 'Excel函数' }, { value: '', formula: '=LEFT(A1,3)', isResult: true }],
        ],
        expectedResult: 'Exc',
      },
    ],
  },
  {
    id: 'right',
    name: 'RIGHT',
    categoryId: 'text',
    syntax: 'RIGHT(text, [num_chars])',
    description: '从文本字符串的右侧返回指定数量的字符',
    returnType: '文本',
    parameters: [
      { name: 'text', description: '要提取字符的文本', required: true, type: '文本' },
      { name: 'num_chars', description: '要提取的字符数，默认为1', required: false, type: '数字' },
    ],
    examples: [
      {
        id: 'right-1',
        formula: '=RIGHT(A1, 2)',
        description: '提取后2个字符',
        inputData: [
          [{ value: 'Excel函数' }, { value: '', formula: '=RIGHT(A1,2)', isResult: true }],
        ],
        expectedResult: '函数',
      },
    ],
  },
  {
    id: 'len',
    name: 'LEN',
    categoryId: 'text',
    syntax: 'LEN(text)',
    description: '返回文本字符串中的字符数',
    returnType: '数字',
    parameters: [
      { name: 'text', description: '要计算长度的文本', required: true, type: '文本' },
    ],
    examples: [
      {
        id: 'len-1',
        formula: '=LEN(A1)',
        description: '计算文本长度',
        inputData: [
          [{ value: 'Hello' }, { value: '', formula: '=LEN(A1)', isResult: true }],
        ],
        expectedResult: '5',
      },
    ],
  },
  {
    id: 'trim',
    name: 'TRIM',
    categoryId: 'text',
    syntax: 'TRIM(text)',
    description: '删除文本中多余的空格，只保留单词间的单个空格',
    returnType: '文本',
    parameters: [
      { name: 'text', description: '要删除空格的文本', required: true, type: '文本' },
    ],
    examples: [
      {
        id: 'trim-1',
        formula: '=TRIM(A1)',
        description: '删除多余空格',
        inputData: [
          [{ value: '  Hello   World  ' }, { value: '', formula: '=TRIM(A1)', isResult: true }],
        ],
        expectedResult: 'Hello World',
      },
    ],
  },
  {
    id: 'upper',
    name: 'UPPER',
    categoryId: 'text',
    syntax: 'UPPER(text)',
    description: '将文本转换为大写',
    returnType: '文本',
    parameters: [
      { name: 'text', description: '要转换的文本', required: true, type: '文本' },
    ],
    examples: [
      {
        id: 'upper-1',
        formula: '=UPPER(A1)',
        description: '转换为大写',
        inputData: [
          [{ value: 'hello' }, { value: '', formula: '=UPPER(A1)', isResult: true }],
        ],
        expectedResult: 'HELLO',
      },
    ],
  },
  {
    id: 'lower',
    name: 'LOWER',
    categoryId: 'text',
    syntax: 'LOWER(text)',
    description: '将文本转换为小写',
    returnType: '文本',
    parameters: [
      { name: 'text', description: '要转换的文本', required: true, type: '文本' },
    ],
    examples: [
      {
        id: 'lower-1',
        formula: '=LOWER(A1)',
        description: '转换为小写',
        inputData: [
          [{ value: 'HELLO' }, { value: '', formula: '=LOWER(A1)', isResult: true }],
        ],
        expectedResult: 'hello',
      },
    ],
  },

  // 数学函数
  {
    id: 'sum',
    name: 'SUM',
    categoryId: 'math',
    syntax: 'SUM(number1, [number2], ...)',
    description: '计算一组数值的总和',
    returnType: '数字',
    parameters: [
      { name: 'number1', description: '第一个数值或范围', required: true, type: '数字' },
      { name: 'number2', description: '其他数值或范围（可选）', required: false, type: '数字' },
    ],
    examples: [
      {
        id: 'sum-1',
        formula: '=SUM(A1:C1)',
        description: '计算A1到C1的总和',
        inputData: [
          [{ value: 10 }, { value: 20 }, { value: 30 }, { value: '', formula: '=SUM(A1:C1)', isResult: true }],
        ],
        expectedResult: '60',
      },
    ],
  },
  {
    id: 'average',
    name: 'AVERAGE',
    categoryId: 'math',
    syntax: 'AVERAGE(number1, [number2], ...)',
    description: '计算一组数值的平均值',
    returnType: '数字',
    parameters: [
      { name: 'number1', description: '第一个数值或范围', required: true, type: '数字' },
      { name: 'number2', description: '其他数值或范围（可选）', required: false, type: '数字' },
    ],
    examples: [
      {
        id: 'average-1',
        formula: '=AVERAGE(A1:C1)',
        description: '计算平均值',
        inputData: [
          [{ value: 10 }, { value: 20 }, { value: 30 }, { value: '', formula: '=AVERAGE(A1:C1)', isResult: true }],
        ],
        expectedResult: '20',
      },
    ],
  },
  {
    id: 'max',
    name: 'MAX',
    categoryId: 'math',
    syntax: 'MAX(number1, [number2], ...)',
    description: '返回一组数值中的最大值',
    returnType: '数字',
    parameters: [
      { name: 'number1', description: '第一个数值或范围', required: true, type: '数字' },
      { name: 'number2', description: '其他数值或范围（可选）', required: false, type: '数字' },
    ],
    examples: [
      {
        id: 'max-1',
        formula: '=MAX(A1:C1)',
        description: '找出最大值',
        inputData: [
          [{ value: 15 }, { value: 42 }, { value: 8 }, { value: '', formula: '=MAX(A1:C1)', isResult: true }],
        ],
        expectedResult: '42',
      },
    ],
  },
  {
    id: 'min',
    name: 'MIN',
    categoryId: 'math',
    syntax: 'MIN(number1, [number2], ...)',
    description: '返回一组数值中的最小值',
    returnType: '数字',
    parameters: [
      { name: 'number1', description: '第一个数值或范围', required: true, type: '数字' },
      { name: 'number2', description: '其他数值或范围（可选）', required: false, type: '数字' },
    ],
    examples: [
      {
        id: 'min-1',
        formula: '=MIN(A1:C1)',
        description: '找出最小值',
        inputData: [
          [{ value: 15 }, { value: 42 }, { value: 8 }, { value: '', formula: '=MIN(A1:C1)', isResult: true }],
        ],
        expectedResult: '8',
      },
    ],
  },
  {
    id: 'count',
    name: 'COUNT',
    categoryId: 'math',
    syntax: 'COUNT(value1, [value2], ...)',
    description: '计算包含数字的单元格数量',
    returnType: '数字',
    parameters: [
      { name: 'value1', description: '第一个值或范围', required: true, type: '任意' },
      { name: 'value2', description: '其他值或范围（可选）', required: false, type: '任意' },
    ],
    examples: [
      {
        id: 'count-1',
        formula: '=COUNT(A1:D1)',
        description: '计算数字单元格数量',
        inputData: [
          [{ value: 10 }, { value: 'text' }, { value: 30 }, { value: 40 }, { value: '', formula: '=COUNT(A1:D1)', isResult: true }],
        ],
        expectedResult: '3',
      },
    ],
  },
  {
    id: 'round',
    name: 'ROUND',
    categoryId: 'math',
    syntax: 'ROUND(number, num_digits)',
    description: '将数字四舍五入到指定的位数',
    returnType: '数字',
    parameters: [
      { name: 'number', description: '要四舍五入的数字', required: true, type: '数字' },
      { name: 'num_digits', description: '要保留的小数位数', required: true, type: '数字' },
    ],
    examples: [
      {
        id: 'round-1',
        formula: '=ROUND(A1, 2)',
        description: '四舍五入到2位小数',
        inputData: [
          [{ value: 3.14159 }, { value: '', formula: '=ROUND(A1,2)', isResult: true }],
        ],
        expectedResult: '3.14',
      },
    ],
  },
  {
    id: 'abs',
    name: 'ABS',
    categoryId: 'math',
    syntax: 'ABS(number)',
    description: '返回数字的绝对值',
    returnType: '数字',
    parameters: [
      { name: 'number', description: '要计算绝对值的数字', required: true, type: '数字' },
    ],
    examples: [
      {
        id: 'abs-1',
        formula: '=ABS(A1)',
        description: '计算绝对值',
        inputData: [
          [{ value: -15 }, { value: '', formula: '=ABS(A1)', isResult: true }],
        ],
        expectedResult: '15',
      },
    ],
  },

  // 日期函数
  {
    id: 'today',
    name: 'TODAY',
    categoryId: 'date',
    syntax: 'TODAY()',
    description: '返回当前日期',
    returnType: '日期',
    parameters: [],
    examples: [
      {
        id: 'today-1',
        formula: '=TODAY()',
        description: '获取今天的日期',
        inputData: [
          [{ value: '', formula: '=TODAY()', isResult: true }],
        ],
        expectedResult: '当前日期',
      },
    ],
  },
  {
    id: 'year',
    name: 'YEAR',
    categoryId: 'date',
    syntax: 'YEAR(date)',
    description: '返回日期的年份',
    returnType: '数字',
    parameters: [
      { name: 'date', description: '要提取年份的日期', required: true, type: '日期' },
    ],
    examples: [
      {
        id: 'year-1',
        formula: '=YEAR(A1)',
        description: '提取年份',
        inputData: [
          [{ value: '2024-03-15' }, { value: '', formula: '=YEAR(A1)', isResult: true }],
        ],
        expectedResult: '2024',
      },
    ],
  },
  {
    id: 'month',
    name: 'MONTH',
    categoryId: 'date',
    syntax: 'MONTH(date)',
    description: '返回日期的月份（1-12）',
    returnType: '数字',
    parameters: [
      { name: 'date', description: '要提取月份的日期', required: true, type: '日期' },
    ],
    examples: [
      {
        id: 'month-1',
        formula: '=MONTH(A1)',
        description: '提取月份',
        inputData: [
          [{ value: '2024-03-15' }, { value: '', formula: '=MONTH(A1)', isResult: true }],
        ],
        expectedResult: '3',
      },
    ],
  },
  {
    id: 'day',
    name: 'DAY',
    categoryId: 'date',
    syntax: 'DAY(date)',
    description: '返回日期的天数（1-31）',
    returnType: '数字',
    parameters: [
      { name: 'date', description: '要提取天数的日期', required: true, type: '日期' },
    ],
    examples: [
      {
        id: 'day-1',
        formula: '=DAY(A1)',
        description: '提取天数',
        inputData: [
          [{ value: '2024-03-15' }, { value: '', formula: '=DAY(A1)', isResult: true }],
        ],
        expectedResult: '15',
      },
    ],
  },
  {
    id: 'datedif',
    name: 'DATEDIF',
    categoryId: 'date',
    syntax: 'DATEDIF(start_date, end_date, unit)',
    description: '计算两个日期之间的差值',
    returnType: '数字',
    parameters: [
      { name: 'start_date', description: '开始日期', required: true, type: '日期' },
      { name: 'end_date', description: '结束日期', required: true, type: '日期' },
      { name: 'unit', description: '返回单位：Y(年)、M(月)、D(天)', required: true, type: '文本' },
    ],
    examples: [
      {
        id: 'datedif-1',
        formula: '=DATEDIF(A1, B1, "D")',
        description: '计算相差天数',
        inputData: [
          [{ value: '2024-01-01' }, { value: '2024-03-15' }, { value: '', formula: '=DATEDIF(A1,B1,"D")', isResult: true }],
        ],
        expectedResult: '74',
      },
    ],
  },

  // 逻辑函数
  {
    id: 'if',
    name: 'IF',
    categoryId: 'logic',
    syntax: 'IF(logical_test, value_if_true, [value_if_false])',
    description: '根据条件返回不同的值',
    returnType: '任意',
    parameters: [
      { name: 'logical_test', description: '要判断的条件', required: true, type: '逻辑值' },
      { name: 'value_if_true', description: '条件为真时返回的值', required: true, type: '任意' },
      { name: 'value_if_false', description: '条件为假时返回的值', required: false, type: '任意' },
    ],
    examples: [
      {
        id: 'if-1',
        formula: '=IF(A1>=60, "及格", "不及格")',
        description: '判断成绩是否及格',
        inputData: [
          [{ value: 75 }, { value: '', formula: '=IF(A1>=60,"及格","不及格")', isResult: true }],
        ],
        expectedResult: '及格',
      },
      {
        id: 'if-2',
        formula: '=IF(A1>=60, "及格", "不及格")',
        description: '判断成绩是否及格',
        inputData: [
          [{ value: 45 }, { value: '', formula: '=IF(A1>=60,"及格","不及格")', isResult: true }],
        ],
        expectedResult: '不及格',
      },
    ],
  },
  {
    id: 'and',
    name: 'AND',
    categoryId: 'logic',
    syntax: 'AND(logical1, [logical2], ...)',
    description: '当所有条件都为真时返回TRUE',
    returnType: '逻辑值',
    parameters: [
      { name: 'logical1', description: '第一个条件', required: true, type: '逻辑值' },
      { name: 'logical2', description: '其他条件（可选）', required: false, type: '逻辑值' },
    ],
    examples: [
      {
        id: 'and-1',
        formula: '=AND(A1>0, A1<100)',
        description: '判断是否在0-100之间',
        inputData: [
          [{ value: 50 }, { value: '', formula: '=AND(A1>0,A1<100)', isResult: true }],
        ],
        expectedResult: 'TRUE',
      },
    ],
  },
  {
    id: 'or',
    name: 'OR',
    categoryId: 'logic',
    syntax: 'OR(logical1, [logical2], ...)',
    description: '当任一条件为真时返回TRUE',
    returnType: '逻辑值',
    parameters: [
      { name: 'logical1', description: '第一个条件', required: true, type: '逻辑值' },
      { name: 'logical2', description: '其他条件（可选）', required: false, type: '逻辑值' },
    ],
    examples: [
      {
        id: 'or-1',
        formula: '=OR(A1="是", A1="Yes")',
        description: '判断是否为肯定回答',
        inputData: [
          [{ value: 'Yes' }, { value: '', formula: '=OR(A1="是",A1="Yes")', isResult: true }],
        ],
        expectedResult: 'TRUE',
      },
    ],
  },
  {
    id: 'iferror',
    name: 'IFERROR',
    categoryId: 'logic',
    syntax: 'IFERROR(value, value_if_error)',
    description: '如果公式出错，返回指定的值',
    returnType: '任意',
    parameters: [
      { name: 'value', description: '要检查的值或公式', required: true, type: '任意' },
      { name: 'value_if_error', description: '出错时返回的值', required: true, type: '任意' },
    ],
    examples: [
      {
        id: 'iferror-1',
        formula: '=IFERROR(A1/B1, "错误")',
        description: '处理除法错误',
        inputData: [
          [{ value: 10 }, { value: 0 }, { value: '', formula: '=IFERROR(A1/B1,"错误")', isResult: true }],
        ],
        expectedResult: '错误',
      },
    ],
  },

  // 查找函数
  {
    id: 'vlookup',
    name: 'VLOOKUP',
    categoryId: 'lookup',
    syntax: 'VLOOKUP(lookup_value, table_array, col_index_num, [range_lookup])',
    description: '在表格的第一列中查找值，返回同一行中指定列的值',
    returnType: '任意',
    parameters: [
      { name: 'lookup_value', description: '要查找的值', required: true, type: '任意' },
      { name: 'table_array', description: '查找的表格范围', required: true, type: '范围' },
      { name: 'col_index_num', description: '返回值所在的列号', required: true, type: '数字' },
      { name: 'range_lookup', description: '是否模糊匹配，FALSE为精确匹配', required: false, type: '逻辑值' },
    ],
    examples: [
      {
        id: 'vlookup-1',
        formula: '=VLOOKUP(E1, A1:C3, 2, FALSE)',
        description: '根据学号查找姓名',
        inputData: [
          [{ value: '001' }, { value: '张三' }, { value: 85 }, { value: '' }, { value: '002' }, { value: '', formula: '=VLOOKUP(E1,A1:C3,2,FALSE)', isResult: true }],
          [{ value: '002' }, { value: '李四' }, { value: 92 }, { value: '' }, { value: '' }, { value: '' }],
          [{ value: '003' }, { value: '王五' }, { value: 78 }, { value: '' }, { value: '' }, { value: '' }],
        ],
        expectedResult: '李四',
      },
    ],
  },
  {
    id: 'index',
    name: 'INDEX',
    categoryId: 'lookup',
    syntax: 'INDEX(array, row_num, [col_num])',
    description: '返回表格或数组中指定位置的值',
    returnType: '任意',
    parameters: [
      { name: 'array', description: '单元格区域或数组', required: true, type: '范围' },
      { name: 'row_num', description: '行号', required: true, type: '数字' },
      { name: 'col_num', description: '列号（可选）', required: false, type: '数字' },
    ],
    examples: [
      {
        id: 'index-1',
        formula: '=INDEX(A1:C3, 2, 2)',
        description: '获取第2行第2列的值',
        inputData: [
          [{ value: 'A' }, { value: 'B' }, { value: 'C' }, { value: '' }, { value: '', formula: '=INDEX(A1:C3,2,2)', isResult: true }],
          [{ value: 'D' }, { value: 'E' }, { value: 'F' }, { value: '' }, { value: '' }],
          [{ value: 'G' }, { value: 'H' }, { value: 'I' }, { value: '' }, { value: '' }],
        ],
        expectedResult: 'E',
      },
    ],
  },
  {
    id: 'match',
    name: 'MATCH',
    categoryId: 'lookup',
    syntax: 'MATCH(lookup_value, lookup_array, [match_type])',
    description: '返回指定值在范围中的相对位置',
    returnType: '数字',
    parameters: [
      { name: 'lookup_value', description: '要查找的值', required: true, type: '任意' },
      { name: 'lookup_array', description: '查找的范围', required: true, type: '范围' },
      { name: 'match_type', description: '匹配类型：1(小于等于)、0(精确)、-1(大于等于)', required: false, type: '数字' },
    ],
    examples: [
      {
        id: 'match-1',
        formula: '=MATCH("李四", A1:A3, 0)',
        description: '查找"李四"的位置',
        inputData: [
          [{ value: '张三' }, { value: '', formula: '=MATCH("李四",A1:A3,0)', isResult: true }],
          [{ value: '李四' }, { value: '' }],
          [{ value: '王五' }, { value: '' }],
        ],
        expectedResult: '2',
      },
    ],
  },
]

export const getFunctionById = (id: string): ExcelFunction | undefined => {
  return excelFunctions.find(fn => fn.id === id)
}

export const getFunctionsByCategory = (categoryId: string): ExcelFunction[] => {
  return excelFunctions.filter(fn => fn.categoryId === categoryId)
}

export const searchFunctions = (query: string): ExcelFunction[] => {
  const lowerQuery = query.toLowerCase()
  return excelFunctions.filter(fn => 
    fn.name.toLowerCase().includes(lowerQuery) ||
    fn.description.toLowerCase().includes(lowerQuery)
  )
}
