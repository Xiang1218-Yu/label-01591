import { ExamQuestion } from '../types'

export const examQuestions: ExamQuestion[] = [
  {
    id: '1',
    question: '在Excel中，SUM函数的主要作用是什么？',
    options: [
      '计算平均值',
      '求和计算',
      '查找最大值',
      '统计数量'
    ],
    correctAnswer: 1,
    functionName: 'SUM',
    difficulty: 1,
    explanation: 'SUM函数用于对指定范围内的数值进行求和计算，是Excel中最常用的函数之一。'
  },
  {
    id: '2',
    question: 'VLOOKUP函数中，第三个参数表示什么？',
    options: [
      '查找值',
      '查找范围',
      '返回列数',
      '匹配方式'
    ],
    correctAnswer: 2,
    functionName: 'VLOOKUP',
    difficulty: 2,
    explanation: 'VLOOKUP函数的语法是VLOOKUP(查找值, 查找范围, 返回列数, 匹配方式)，第三个参数指定要返回的列号。'
  },
  {
    id: '3',
    question: 'IF函数最多可以嵌套多少层（Excel 2007及以后版本）？',
    options: [
      '7层',
      '64层',
      '128层',
      '无限层'
    ],
    correctAnswer: 1,
    functionName: 'IF',
    difficulty: 2,
    explanation: 'Excel 2007及以后版本中，IF函数最多可以嵌套64层。'
  },
  {
    id: '4',
    question: '下列哪个函数可以用于去除文本中的空格？',
    options: [
      'TRIM',
      'CLEAN',
      'SUBSTITUTE',
      'TEXT'
    ],
    correctAnswer: 0,
    functionName: 'TRIM',
    difficulty: 1,
    explanation: 'TRIM函数用于删除文本字符串中的首尾空格，以及文本中间的多余空格（只保留一个）。'
  },
  {
    id: '5',
    question: 'COUNTIF函数的作用是？',
    options: [
      '计算总和',
      '按条件计数',
      '查找数据',
      '计算平均值'
    ],
    correctAnswer: 1,
    functionName: 'COUNTIF',
    difficulty: 1,
    explanation: 'COUNTIF函数用于统计某个区域中满足指定条件的单元格数量。'
  },
  {
    id: '6',
    question: 'INDEX函数和MATCH函数组合使用可以实现什么功能？',
    options: [
      '数据求和',
      '数据查找（比VLOOKUP更灵活）',
      '数据排序',
      '数据筛选'
    ],
    correctAnswer: 1,
    functionName: 'INDEX+MATCH',
    difficulty: 3,
    explanation: 'INDEX+MATCH组合可以实现比VLOOKUP更灵活的数据查找，支持从任意列查找，支持向左查找。'
  },
  {
    id: '7',
    question: '下列哪个函数可以用于提取文本字符串中的左边字符？',
    options: [
      'RIGHT',
      'MID',
      'LEFT',
      'LEN'
    ],
    correctAnswer: 2,
    functionName: 'LEFT',
    difficulty: 1,
    explanation: 'LEFT函数用于从文本字符串的左侧提取指定数量的字符。'
  },
  {
    id: '8',
    question: 'AVERAGEIF函数的作用是？',
    options: [
      '计算所有数值的平均值',
      '按条件计算平均值',
      '计算最大值',
      '计算最小值'
    ],
    correctAnswer: 1,
    functionName: 'AVERAGEIF',
    difficulty: 2,
    explanation: 'AVERAGEIF函数用于计算某个区域中满足指定条件的所有单元格的平均值。'
  },
  {
    id: '9',
    question: 'CONCATENATE函数的作用是？',
    options: [
      '拆分文本',
      '连接文本',
      '替换文本',
      '查找文本'
    ],
    correctAnswer: 1,
    functionName: 'CONCATENATE',
    difficulty: 1,
    explanation: 'CONCATENATE函数用于将多个文本字符串连接成一个文本字符串。'
  },
  {
    id: '10',
    question: '下列哪个函数可以返回当前日期和时间？',
    options: [
      'DATE',
      'TIME',
      'NOW',
      'TODAY'
    ],
    correctAnswer: 2,
    functionName: 'NOW',
    difficulty: 1,
    explanation: 'NOW函数返回当前的日期和时间，TODAY函数只返回当前日期。'
  }
]

export const getRandomExamQuestions = (count: number = 10): ExamQuestion[] => {
  const shuffled = [...examQuestions].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}
