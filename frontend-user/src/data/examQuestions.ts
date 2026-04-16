import { ExamQuestion } from '../types'

// Excel函数考试题目数据
export const examQuestions: ExamQuestion[] = [
  {
    id: '1',
    question: '在Excel中，SUM函数的作用是什么？',
    options: [
      '计算平均值',
      '求和计算',
      '查找数据',
      '统计数量'
    ],
    correctAnswer: 1,
    functionName: 'SUM',
    difficulty: 1,
    explanation: 'SUM函数用于对指定范围内的数值进行求和计算，是Excel中最常用的函数之一。'
  },
  {
    id: '2',
    question: 'VLOOKUP函数中第一个参数表示什么？',
    options: [
      '查找范围',
      '要查找的值',
      '返回列数',
      '匹配方式'
    ],
    correctAnswer: 1,
    functionName: 'VLOOKUP',
    difficulty: 2,
    explanation: 'VLOOKUP函数的第一个参数是要在查找范围第一列中查找的值。'
  },
  {
    id: '3',
    question: 'IF函数的正确语法格式是？',
    options: [
      'IF(条件, 真值)',
      'IF(真值, 假值, 条件)',
      'IF(条件, 真值, 假值)',
      'IF(假值, 真值, 条件)'
    ],
    correctAnswer: 2,
    functionName: 'IF',
    difficulty: 1,
    explanation: 'IF函数的语法是IF(条件, 真值, 假值)，根据条件判断返回不同的值。'
  },
  {
    id: '4',
    question: '要计算A1:A10范围内的平均值，应该使用哪个函数？',
    options: [
      'SUM(A1:A10)',
      'COUNT(A1:A10)',
      'AVERAGE(A1:A10)',
      'MAX(A1:A10)'
    ],
    correctAnswer: 2,
    functionName: 'AVERAGE',
    difficulty: 1,
    explanation: 'AVERAGE函数用于计算指定范围内数值的平均值。'
  },
  {
    id: '5',
    question: 'INDEX和MATCH组合使用相比VLOOKUP的优势是什么？',
    options: [
      '计算速度更快',
      '支持反向查找',
      '语法更简单',
      '支持多工作表'
    ],
    correctAnswer: 1,
    functionName: 'INDEX/MATCH',
    difficulty: 3,
    explanation: 'INDEX+MATCH组合支持从左向右或从右向左查找，而VLOOKUP只能从左向右查找。'
  },
  {
    id: '6',
    question: 'COUNTIF函数的作用是？',
    options: [
      '统计所有单元格数量',
      '按条件统计单元格数量',
      '求和计算',
      '查找重复值'
    ],
    correctAnswer: 1,
    functionName: 'COUNTIF',
    difficulty: 2,
    explanation: 'COUNTIF函数用于统计满足指定条件的单元格数量。'
  },
  {
    id: '7',
    question: '在Excel中，哪个函数用于获取当前日期？',
    options: [
      'TIME()',
      'NOW()',
      'TODAY()',
      'DATE()'
    ],
    correctAnswer: 2,
    functionName: 'TODAY',
    difficulty: 1,
    explanation: 'TODAY()函数返回当前日期，NOW()返回日期和时间。'
  },
  {
    id: '8',
    question: 'CONCATENATE函数或&运算符的作用是？',
    options: [
      '数值相加',
      '文本连接',
      '逻辑与运算',
      '单元格合并'
    ],
    correctAnswer: 1,
    functionName: 'CONCATENATE',
    difficulty: 1,
    explanation: 'CONCATENATE函数或&运算符用于将多个文本字符串连接成一个字符串。'
  },
  {
    id: '9',
    question: 'PMT函数主要用于什么场景？',
    options: [
      '计算投资收益',
      '计算贷款月供',
      '计算折旧值',
      '计算净现值'
    ],
    correctAnswer: 1,
    functionName: 'PMT',
    difficulty: 3,
    explanation: 'PMT函数基于固定利率及等额分期付款方式，返回贷款的每期付款额。'
  },
  {
    id: '10',
    question: '关于数组公式，以下说法正确的是？',
    options: [
      '只能对单行数据计算',
      '需要按Ctrl+Shift+Enter确认',
      '不能使用函数嵌套',
      '只能返回单个值'
    ],
    correctAnswer: 1,
    functionName: '数组公式',
    difficulty: 3,
    explanation: '传统数组公式需要按Ctrl+Shift+Enter组合键确认输入，Excel 365支持动态数组。'
  }
]

// 获取随机考试题目
export const getRandomExamQuestions = (count: number = 10): ExamQuestion[] => {
  const shuffled = [...examQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
