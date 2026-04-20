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
  functionId: string
  functionName: string
  question: string
  answer: string
  difficulty: 1 | 2 | 3
  score: number // 题目分值
  inputData?: CellData[][]
  options?: string[] // 选择题选项（如果是选择题）
  questionType: 'single' | 'multiple' | 'fill' | 'practical' // 题目类型：单选、多选、填空、实操
}

// 考试结果类型
export interface ExamResult {
  id: string
  examName: string
  totalScore: number // 总分
  userScore: number // 用户得分
  passScore: number // 及格分数
  passed: boolean // 是否通过
  startTime: Date
  endTime: Date
  duration: number // 考试时长（分钟）
  answers: {
    questionId: string
    userAnswer: string
    isCorrect: boolean
    score: number // 该题得分
  }[]
}

// 证书类型
export interface Certificate {
  id: string
  userId: string
  userName: string
  certificateName: string
  examName: string
  score: number
  issueDate: Date
  expireDate?: Date
  certificateNumber: string // 证书编号
  level: 'A' | 'B' | 'C' | 'D' // 等级：A(90-100)、B(80-89)、C(70-79)、D(60-69)
}
