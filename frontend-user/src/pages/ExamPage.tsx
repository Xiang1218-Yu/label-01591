import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, Check, AlertCircle, BookOpen, Award } from 'lucide-react'
import { ExamQuestion, ExamResult } from '../types'
import SpreadSheet from '../components/SpreadSheet'
import { toast } from '../components/Toast'

// 模拟考试题目数据
const mockExamQuestions: ExamQuestion[] = [
  {
    id: '1',
    functionId: 'sum',
    functionName: 'SUM',
    question: 'SUM函数的作用是什么？',
    answer: 'A',
    difficulty: 1,
    score: 10,
    questionType: 'single',
    options: [
      '计算单元格区域中所有数值的和',
      '计算单元格区域的平均值',
      '统计单元格的数量',
      '查找最大值'
    ]
  },
  {
    id: '2',
    functionId: 'vlookup',
    functionName: 'VLOOKUP',
    question: 'VLOOKUP函数的第三个参数表示什么？',
    answer: 'B',
    difficulty: 2,
    score: 15,
    questionType: 'single',
    options: [
      '要查找的值',
      '返回值所在的列号',
      '查找范围',
      '匹配方式'
    ]
  },
  {
    id: '3',
    functionId: 'if',
    functionName: 'IF',
    question: '如果A1单元格的值大于10，返回"合格"，否则返回"不合格"，正确的公式是？',
    answer: '=IF(A1>10,"合格","不合格")',
    difficulty: 2,
    score: 15,
    questionType: 'fill'
  },
  {
    id: '4',
    functionId: 'countif',
    functionName: 'COUNTIF',
    question: '统计A1:A10区域中大于5的单元格数量，正确的公式是？',
    answer: '=COUNTIF(A1:A10,">5")',
    difficulty: 3,
    score: 20,
    questionType: 'fill'
  },
  {
    id: '5',
    functionId: 'average',
    functionName: 'AVERAGE',
    question: '计算A1:A5单元格的平均值，如果单元格为空则忽略，正确的公式是？',
    answer: '=AVERAGE(A1:A5)',
    difficulty: 1,
    score: 10,
    questionType: 'fill'
  },
  {
    id: '6',
    functionId: 'sumif',
    functionName: 'SUMIF',
    question: '对A1:A10中大于10的数值求和，正确的公式是？',
    answer: '=SUMIF(A1:A10,">10")',
    difficulty: 3,
    score: 20,
    questionType: 'fill'
  },
  {
    id: '7',
    functionId: 'max',
    functionName: 'MAX',
    question: 'MAX函数的作用是查找单元格区域中的最小值，这个说法是否正确？',
    answer: 'B',
    difficulty: 1,
    score: 10,
    questionType: 'single',
    options: [
      '正确',
      '错误'
    ]
  }
]

const EXAM_DURATION = 45 // 考试时长45分钟
const PASS_SCORE = 60 // 及格分数60分

const ExamPage = () => {
  const navigate = useNavigate()
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION * 60) // 剩余时间（秒）
  const [examStarted, setExamStarted] = useState(false)
  const [examSubmitted, setExamSubmitted] = useState(false)
  const [examResult, setExamResult] = useState<ExamResult | null>(null)
  const [startTime, setStartTime] = useState<Date>(new Date())

  const currentQuestion = mockExamQuestions[currentQuestionIndex]
  const totalQuestions = mockExamQuestions.length
  const totalScore = mockExamQuestions.reduce((sum, q) => sum + q.score, 0)

  // 计时器
  useEffect(() => {
    if (!examStarted || examSubmitted || timeLeft <= 0) return

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          handleSubmitExam()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [examStarted, examSubmitted, timeLeft])

  // 格式化时间
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  // 开始考试
  const handleStartExam = () => {
    setExamStarted(true)
    setStartTime(new Date())
    toast.info('考试开始，祝你顺利！')
  }

  // 选择答案
  const handleSelectAnswer = (answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentQuestion.id]: answer
    }))
  }

  // 下一题
  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
    }
  }

  // 上一题
  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1)
    }
  }

  // 跳转到指定题目
  const handleJumpToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  // 提交考试
  const handleSubmitExam = () => {
    if (!window.confirm('确定要提交考试吗？提交后将无法修改答案。')) {
      return
    }

    setExamSubmitted(true)
    
    // 计算得分
    let userScore = 0
    const answers = mockExamQuestions.map(question => {
      const userAnswer = userAnswers[question.id] || ''
      const isCorrect = userAnswer.trim().toUpperCase() === question.answer.trim().toUpperCase()
      const score = isCorrect ? question.score : 0
      userScore += score
      
      return {
        questionId: question.id,
        userAnswer,
        isCorrect,
        score
      }
    })

    const passed = userScore >= PASS_SCORE
    const endTime = new Date()
    const duration = Math.floor((endTime.getTime() - startTime.getTime()) / 1000 / 60)

    const result: ExamResult = {
      id: `exam_${Date.now()}`,
      examName: 'Excel函数技能认证考试',
      totalScore,
      userScore,
      passScore: PASS_SCORE,
      passed,
      startTime,
      endTime,
      duration,
      answers
    }

    setExamResult(result)

    // 保存考试结果到localStorage
    const existingResults = JSON.parse(localStorage.getItem('examResults') || '[]')
    localStorage.setItem('examResults', JSON.stringify([...existingResults, result]))

    if (passed) {
      toast.success(`恭喜你通过考试！得分：${userScore}/${totalScore}`)
    } else {
      toast.error(`很遗憾，你未通过考试。得分：${userScore}/${totalScore}`)
    }
  }

  // 查看证书
  const handleViewCertificate = () => {
    if (examResult?.passed) {
      navigate(`/certificate/${examResult.id}`)
    }
  }

  // 重新考试
  const handleRetakeExam = () => {
    setCurrentQuestionIndex(0)
    setUserAnswers({})
    setTimeLeft(EXAM_DURATION * 60)
    setExamStarted(false)
    setExamSubmitted(false)
    setExamResult(null)
  }

  if (!examStarted) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">Excel函数技能认证考试</h1>
          </div>

          <div className="space-y-4 mb-8">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2">考试说明</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>考试时长：{EXAM_DURATION}分钟</li>
                <li>题目数量：{totalQuestions}道</li>
                <li>总分：{totalScore}分</li>
                <li>及格分数：{PASS_SCORE}分</li>
                <li>题型包括：单选题、填空题</li>
                <li>考试过程中可以随时切换题目</li>
                <li>提交后立即显示考试结果</li>
                <li>通过考试可获得官方认证证书</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <h3 className="font-semibold text-yellow-800 mb-2">注意事项</h3>
              <ul className="list-disc pl-5 text-gray-700 space-y-1">
                <li>考试开始后计时器将自动开始</li>
                <li>时间到后系统将自动提交试卷</li>
                <li>提交后无法修改答案</li>
                <li>请确保网络连接正常</li>
              </ul>
            </div>
          </div>

          <button
            onClick={handleStartExam}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            开始考试
          </button>
        </div>
      </div>
    )
  }

  if (examSubmitted && examResult) {
    return (
      <div className="max-w-4xl mx-auto py-10 px-4">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            {examResult.passed ? (
              <Award className="w-8 h-8 text-green-600" />
            ) : (
              <AlertCircle className="w-8 h-8 text-red-600" />
            )}
            <h1 className="text-2xl font-bold text-gray-800">考试结果</h1>
          </div>

          <div className={`p-6 rounded-lg mb-8 ${
            examResult.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <div className="text-center mb-4">
              <h2 className={`text-3xl font-bold mb-2 ${
                examResult.passed ? 'text-green-700' : 'text-red-700'
              }`}>
                {examResult.passed ? '恭喜通过考试！' : '很遗憾，未通过考试'}
              </h2>
              <p className="text-lg text-gray-700">
                你的得分：<span className="font-bold">{examResult.userScore}</span> / {examResult.totalScore}
              </p>
              <p className="text-gray-600 mt-1">
                及格分数：{examResult.passScore}分
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">用时</p>
                <p className="font-semibold">{examResult.duration}分钟</p>
              </div>
              <div className="bg-white p-3 rounded-lg shadow-sm">
                <p className="text-sm text-gray-500">正确率</p>
                <p className="font-semibold">{Math.round((examResult.userScore / examResult.totalScore) * 100)}%</p>
              </div>
            </div>
          </div>

          <div className="space-y-6 mb-8">
            <h3 className="text-lg font-semibold text-gray-800">答题详情</h3>
            {examResult.answers.map((answer, index) => {
              const question = mockExamQuestions.find(q => q.id === answer.questionId)!
              return (
                <div key={answer.questionId} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      answer.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {answer.isCorrect ? <Check className="w-4 h-4" /> : '×'}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800">
                        {index + 1}. {question.question} ({question.score}分)
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        正确答案：<span className="font-medium">{question.answer}</span>
                      </p>
                      <p className={`text-sm mt-1 ${answer.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                        你的答案：<span className="font-medium">{answer.userAnswer || '未作答'}</span>
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          <div className="flex gap-4">
            {examResult.passed && (
              <button
                onClick={handleViewCertificate}
                className="flex-1 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Award className="w-5 h-5" />
                查看证书
              </button>
            )}
            <button
              onClick={handleRetakeExam}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
            >
              重新考试
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      {/* 顶部导航栏 */}
      <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Clock className="w-5 h-5 text-blue-600" />
          <span className={`font-mono font-semibold ${timeLeft < 300 ? 'text-red-600' : 'text-gray-700'}`}>
            剩余时间：{formatTime(timeLeft)}
          </span>
        </div>
        <div className="text-sm text-gray-600">
          题目：{currentQuestionIndex + 1} / {totalQuestions}
        </div>
        <div className="text-sm text-gray-600">
          已答：{Object.keys(userAnswers).length} / {totalQuestions}
        </div>
      </div>

      {/* 题目内容 */}
      <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-800">
              第 {currentQuestionIndex + 1} 题 ({currentQuestion.score}分)
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              currentQuestion.difficulty === 1 ? 'bg-green-100 text-green-700' :
              currentQuestion.difficulty === 2 ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              {currentQuestion.difficulty === 1 ? '简单' : currentQuestion.difficulty === 2 ? '中等' : '困难'}
            </span>
          </div>
          <p className="text-gray-700 mb-4">{currentQuestion.question}</p>

          {/* 如果有表格数据，显示表格 */}
          {currentQuestion.inputData && (
            <div className="mb-6 overflow-x-auto">
              <SpreadSheet data={currentQuestion.inputData} />
            </div>
          )}

          {/* 根据题型展示不同的答题区域 */}
          {currentQuestion.questionType === 'single' && currentQuestion.options && (
            <div className="space-y-3">
              {currentQuestion.options.map((option, index) => {
                const optionKey = ['A', 'B', 'C', 'D'][index]
                const isSelected = userAnswers[currentQuestion.id] === optionKey
                return (
                  <label
                    key={index}
                    className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
                      isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question_${currentQuestion.id}`}
                      value={optionKey}
                      checked={isSelected}
                      onChange={() => handleSelectAnswer(optionKey)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <span className="ml-3">
                      <span className="font-medium">{optionKey}. </span>
                      {option}
                    </span>
                  </label>
                )
              })}
            </div>
          )}

          {currentQuestion.questionType === 'fill' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                请输入答案（公式不需要等号也可，系统会自动匹配）
              </label>
              <input
                type="text"
                value={userAnswers[currentQuestion.id] || ''}
                onChange={(e) => handleSelectAnswer(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="请输入你的答案..."
              />
            </div>
          )}
        </div>

        {/* 题目导航按钮 */}
        <div className="flex justify-between">
          <button
            onClick={handlePrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            上一题
          </button>
          {currentQuestionIndex < totalQuestions - 1 ? (
            <button
              onClick={handleNextQuestion}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              下一题
            </button>
          ) : (
            <button
              onClick={handleSubmitExam}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              提交考试
            </button>
          )}
        </div>
      </div>

      {/* 题目导航栏 */}
      <div className="bg-white rounded-xl shadow-lg p-4">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">题目导航</h3>
        <div className="grid grid-cols-7 gap-2">
          {mockExamQuestions.map((_, index) => {
            const isAnswered = !!userAnswers[mockExamQuestions[index].id]
            const isCurrent = currentQuestionIndex === index
            return (
              <button
                key={index}
                onClick={() => handleJumpToQuestion(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                  isCurrent ? 'bg-blue-600 text-white' :
                  isAnswered ? 'bg-green-100 text-green-700 border border-green-300' :
                  'bg-gray-100 text-gray-600 border border-gray-200 hover:border-blue-300'
                }`}
              >
                {index + 1}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default ExamPage
