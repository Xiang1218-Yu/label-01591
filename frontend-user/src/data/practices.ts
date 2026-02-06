import { PracticeQuestion } from '../types'

export const practiceQuestions: PracticeQuestion[] = [
  // 文本函数练习
  {
    id: 'p1',
    functionId: 'concat',
    functionName: 'CONCAT',
    question: '如何将A1单元格的"Hello"和B1单元格的"World"合并成"HelloWorld"？',
    answer: '=CONCAT(A1,B1)',
    hint: '使用CONCAT函数，参数是要合并的单元格',
    difficulty: 1,
  },
  {
    id: 'p2',
    functionId: 'left',
    functionName: 'LEFT',
    question: '如何从A1单元格的文本"Excel函数学习"中提取前5个字符？',
    answer: '=LEFT(A1,5)',
    hint: '使用LEFT函数，第二个参数是要提取的字符数',
    difficulty: 1,
  },
  {
    id: 'p3',
    functionId: 'upper',
    functionName: 'UPPER',
    question: '如何将A1单元格的"hello world"转换为大写？',
    answer: '=UPPER(A1)',
    hint: '使用UPPER函数可以将文本转为大写',
    difficulty: 1,
  },

  // 数学函数练习
  {
    id: 'p4',
    functionId: 'sum',
    functionName: 'SUM',
    question: '如何计算A1到A5单元格的数值总和？',
    answer: '=SUM(A1:A5)',
    hint: '使用SUM函数，参数是要求和的范围',
    difficulty: 1,
  },
  {
    id: 'p5',
    functionId: 'average',
    functionName: 'AVERAGE',
    question: '如何计算B1到B10单元格的平均值？',
    answer: '=AVERAGE(B1:B10)',
    hint: '使用AVERAGE函数计算平均值',
    difficulty: 1,
  },
  {
    id: 'p6',
    functionId: 'round',
    functionName: 'ROUND',
    question: '如何将A1单元格的3.14159四舍五入到2位小数？',
    answer: '=ROUND(A1,2)',
    hint: '使用ROUND函数，第二个参数是保留的小数位数',
    difficulty: 2,
  },

  // 日期函数练习
  {
    id: 'p7',
    functionId: 'year',
    functionName: 'YEAR',
    question: '如何从A1单元格的日期"2024-03-15"中提取年份？',
    answer: '=YEAR(A1)',
    hint: '使用YEAR函数提取年份',
    difficulty: 1,
  },
  {
    id: 'p8',
    functionId: 'datedif',
    functionName: 'DATEDIF',
    question: '如何计算A1(2024-01-01)和B1(2024-12-31)之间相差多少天？',
    answer: '=DATEDIF(A1,B1,"D")',
    hint: '使用DATEDIF函数，第三个参数"D"表示返回天数',
    difficulty: 2,
  },

  // 逻辑函数练习
  {
    id: 'p9',
    functionId: 'if',
    functionName: 'IF',
    question: '如何判断A1单元格的成绩是否>=60，及格显示"通过"，否则显示"未通过"？',
    answer: '=IF(A1>=60,"通过","未通过")',
    hint: '使用IF函数，格式为IF(条件,真值,假值)',
    difficulty: 2,
  },
  {
    id: 'p10',
    functionId: 'iferror',
    functionName: 'IFERROR',
    question: '如何在A1/B1出错时显示"计算错误"？',
    answer: '=IFERROR(A1/B1,"计算错误")',
    hint: '使用IFERROR函数包裹可能出错的公式',
    difficulty: 2,
  },

  // 查找函数练习
  {
    id: 'p11',
    functionId: 'vlookup',
    functionName: 'VLOOKUP',
    question: '在A1:C10的表格中，根据E1的值在第一列查找，返回第2列的值（精确匹配），应该怎么写？',
    answer: '=VLOOKUP(E1,A1:C10,2,FALSE)',
    hint: 'VLOOKUP的参数：查找值、表格范围、返回列号、匹配类型',
    difficulty: 3,
  },
  {
    id: 'p12',
    functionId: 'index',
    functionName: 'INDEX',
    question: '如何获取A1:D5区域中第3行第2列的值？',
    answer: '=INDEX(A1:D5,3,2)',
    hint: 'INDEX函数的参数：范围、行号、列号',
    difficulty: 2,
  },

  // 综合练习
  {
    id: 'p13',
    functionId: 'if',
    functionName: 'IF+AND',
    question: '如何判断A1>=60且A1<=100时显示"有效成绩"，否则显示"无效"？',
    answer: '=IF(AND(A1>=60,A1<=100),"有效成绩","无效")',
    hint: '使用IF和AND函数组合，AND用于多条件判断',
    difficulty: 3,
  },
  {
    id: 'p14',
    functionId: 'concat',
    functionName: 'CONCAT+UPPER',
    question: '如何将A1和B1的文本合并后转为大写？',
    answer: '=UPPER(CONCAT(A1,B1))',
    hint: '可以嵌套使用函数，先CONCAT再UPPER',
    difficulty: 3,
  },
]

export const getPracticesByDifficulty = (difficulty: number): PracticeQuestion[] => {
  return practiceQuestions.filter(q => q.difficulty === difficulty)
}

export const getPracticesByFunction = (functionId: string): PracticeQuestion[] => {
  return practiceQuestions.filter(q => q.functionId === functionId)
}
