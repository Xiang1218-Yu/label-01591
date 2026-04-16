// 函数分类
export interface FunctionCategory {
  id: string
  name: string
  icon: string
  description: string
  color: string
}

// 函数参数
export interface FunctionParameter {
  name: string
  description: string
  required: boolean
  type: string
}

// Excel函数
export interface ExcelFunction {
  id: string
  name: string
  categoryId: string
  syntax: string
  description: string
  parameters: FunctionParameter[]
  returnType: string
  examples: FunctionExample[]
}

// 函数示例
export interface FunctionExample {
  id: string
  formula: string
  description: string
  inputData: CellData[][]
  expectedResult: string
}

// 单元格数据
export interface CellData {
  value: string | number
  formula?: string
  isResult?: boolean
}

// 练习题
export interface PracticeQuestion {
  id: string
  functionId: string
  functionName: string
  question: string
  answer: string
  hint: string
  difficulty: 1 | 2 | 3
  inputData?: CellData[][]
}

// 用户答题记录
export interface UserAnswer {
  questionId: string
  userAnswer: string
  isCorrect: boolean
  answeredAt: Date
}

// Toast消息类型
export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastMessage {
  id: string
  type: ToastType
  message: string
  duration?: number
}

// 考试题目类型
export interface ExamQuestion {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  functionName: string
  difficulty: 1 | 2 | 3
  explanation: string
}

// 考试记录
export interface ExamRecord {
  id: string
  score: number
  totalQuestions: number
  correctCount: number
  passed: boolean
  examDate: Date
  answers: ExamAnswer[]
}

// 考试答题记录
export interface ExamAnswer {
  questionId: string
  userAnswer: number
  isCorrect: boolean
}

// 证书信息
export interface Certificate {
  id: string
  certificateNumber: string
  userName: string
  score: number
  issueDate: Date
  examId: string
  level: '初级' | '中级' | '高级'
}
