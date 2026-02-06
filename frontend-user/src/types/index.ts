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
