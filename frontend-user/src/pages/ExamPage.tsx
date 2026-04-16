import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Clock, CheckCircle, XCircle, Award, RotateCcw, Play, ChevronLeft, ChevronRight, Send } from 'lucide-react'
import { ExamQuestion, ExamRecord, CERTIFICATE_LEVELS } from '../types'
import { examQuestions } from '../data/examQuestions'
import { useStore } from '../store/useStore'

// 考试页面组件
const ExamPage = () => {
  const navigate = useNavigate()
  const addExamRecord = useStore((state) => state.addExamRecord)
  const bestExamRecord = useStore((state) => state.getBestExamRecord())

  // 考试状态
  const [examState, setExamState] = useState<'idle' | 'inProgress' | 'finished'>('idle')
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, number>>({})
  const [examResult, setExamResult] = useState<ExamRecord | null>(null)
  const [questions, setQuestions] = useState<ExamQuestion[]>([])

  const currentQuestion = questions[currentQuestionIndex]
  const answeredCount = Object.keys(selectedAnswers).length

  // 开始考试
  const startExam = () => {
    // 随机选择10道题目
    const shuffled = [...examQuestions].sort(() => Math.random() - 0.5)
    setQuestions(shuffled.slice(0, 10))
    setExamState('inProgress')
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setExamResult(null)
  }

  // 选择答案
  const selectAnswer = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestion.id]: optionIndex,
    })
  }

  // 上一题
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
    }
  }

  // 下一题
  const nextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
    }
  }

  // 跳转到指定题目
  const goToQuestion = (index: number) => {
    setCurrentQuestionIndex(index)
  }

  // 提交试卷
  const submitExam = () => {
    finishExam()
  }

  // 完成考试
  const finishExam = () => {
    let correctCount = 0
    const answers = questions.map((q) => {
      const userAnswer = selectedAnswers[q.id] ?? -1
      const isCorrect = userAnswer === q.correctAnswer
      if (isCorrect) correctCount++
      return {
        questionId: q.id,
        userAnswer,
        isCorrect,
      }
    })

    const score = Math.round((correctCount / questions.length) * 100)
    const record: ExamRecord = {
      id: Date.now().toString(),
      score,
      totalQuestions: questions.length,
      passed: score >= CERTIFICATE_LEVELS.bronze.minScore,
      completedAt: new Date(),
      answers,
    }

    setExamResult(record)
    addExamRecord(record)
    setExamState('finished')
  }

  // 获取难度标签
  const getDifficultyLabel = (difficulty: number) => {
    const labels = ['简单', '中等', '困难']
    const colors = ['bg-green-100 text-green-700', 'bg-yellow-100 text-yellow-700', 'bg-red-100 text-red-700']
    return (
      <span className={`px-2 py-1 rounded text-xs font-medium ${colors[difficulty - 1]}`}>
        {labels[difficulty - 1]}
      </span>
    )
  }

  // 初始状态 - 考试介绍
  if (examState === 'idle') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <Award className="w-16 h-16 mx-auto text-blue-600 mb-4" />
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Excel函数技能考试</h1>
          <p className="text-gray-600">测试你的Excel函数掌握水平，获得认证证书</p>
        </div>

        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">考试说明</h2>
          <ul className="space-y-3 text-gray-600">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>共10道选择题，每题10分，满分100分</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>可以自由切换题目，修改答案</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>全部答完后统一提交试卷</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>60分及以上可获得青铜证书</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>80分及以上可获得白银证书</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span>95分及以上可获得黄金证书</span>
            </li>
          </ul>
        </div>

        {bestExamRecord && (
          <div className="bg-blue-50 rounded-xl p-6 mb-6">
            <h3 className="font-semibold text-blue-800 mb-2">历史最好成绩</h3>
            <div className="flex items-center gap-4">
              <span className="text-3xl font-bold text-blue-600">{bestExamRecord.score}分</span>
              <span className="text-gray-600">
                {new Date(bestExamRecord.completedAt).toLocaleDateString('zh-CN')}
              </span>
            </div>
          </div>
        )}

        <button
          onClick={startExam}
          className="w-full bg-blue-600 text-white py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5" />
          开始考试
        </button>
      </div>
    )
  }

  // 考试进行中
  if (examState === 'inProgress' && currentQuestion) {
    const selectedAnswer = selectedAnswers[currentQuestion.id]

    return (
      <div className="max-w-4xl mx-auto">
        {/* 进度条 */}
        <div className="mb-6">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              已答 {answeredCount} / {questions.length} 题
            </span>
            <div className="flex items-center gap-1 text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="text-sm">正在答题</span>
            </div>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 transition-all duration-300"
              style={{ width: `${(answeredCount / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex gap-6">
          {/* 左侧：题目导航 */}
          <div className="w-48 flex-shrink-0">
            <div className="bg-white rounded-xl shadow-md p-4 sticky top-4">
              <h3 className="font-semibold text-gray-800 mb-4 text-center">题目导航</h3>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((_, index) => {
                  const isAnswered = selectedAnswers[questions[index].id] !== undefined
                  const isCurrent = index === currentQuestionIndex
                  return (
                    <button
                      key={index}
                      onClick={() => goToQuestion(index)}
                      className={`w-10 h-10 rounded-lg font-medium transition-all ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : isAnswered
                          ? 'bg-green-100 text-green-700 border-2 border-green-500'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {index + 1}
                    </button>
                  )
                })}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                  <div className="w-4 h-4 bg-green-100 border-2 border-green-500 rounded" />
                  <span>已答</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div className="w-4 h-4 bg-gray-100 rounded" />
                  <span>未答</span>
                </div>
              </div>
            </div>
          </div>

          {/* 右侧：题目内容 */}
          <div className="flex-1">
            {/* 题目卡片 */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  {getDifficultyLabel(currentQuestion.difficulty)}
                  <span className="text-sm text-gray-500">
                    相关函数：{currentQuestion.functionName}
                  </span>
                </div>
                <span className="text-lg font-semibold text-gray-800">
                  第 {currentQuestionIndex + 1} 题
                </span>
              </div>

              <h2 className="text-xl font-semibold text-gray-800 mb-6">
                {currentQuestion.question}
              </h2>

              {/* 选项列表 */}
              <div className="space-y-3">
                {currentQuestion.options.map((option, index) => {
                  const isSelected = selectedAnswer === index

                  return (
                    <button
                      key={index}
                      onClick={() => selectAnswer(index)}
                      className={`w-full text-left p-4 rounded-lg transition-all border-2 ${
                        isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-blue-400'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                            isSelected
                              ? 'bg-blue-500 text-white'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {String.fromCharCode(65 + index)}
                        </span>
                        <span className="text-gray-700">{option}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* 操作按钮 */}
            <div className="flex gap-4">
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-colors ${
                  currentQuestionIndex === 0
                    ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <ChevronLeft className="w-5 h-5" />
                上一题
              </button>

              {currentQuestionIndex < questions.length - 1 ? (
                <button
                  onClick={nextQuestion}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                >
                  下一题
                  <ChevronRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={submitExam}
                  disabled={answeredCount < questions.length}
                  className={`flex-1 py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    answeredCount >= questions.length
                      ? 'bg-green-600 text-white hover:bg-green-700'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <Send className="w-5 h-5" />
                  提交试卷
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // 考试结束 - 显示结果和答案解析
  if (examState === 'finished' && examResult) {
    const getScoreColor = () => {
      if (examResult.score >= 95) return 'text-yellow-500'
      if (examResult.score >= 80) return 'text-gray-500'
      if (examResult.score >= 60) return 'text-orange-500'
      return 'text-red-500'
    }

    return (
      <div className="max-w-3xl mx-auto">
        {/* 成绩卡片 */}
        <div className="bg-white rounded-xl shadow-md p-8 mb-8 text-center">
          <div className="mb-6">
            {examResult.passed ? (
              <Award className={`w-20 h-20 mx-auto mb-4 ${getScoreColor()}`} />
            ) : (
              <XCircle className="w-20 h-20 mx-auto mb-4 text-red-500" />
            )}
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {examResult.passed ? '恭喜通过考试！' : '未能通过考试'}
            </h1>
            <p className="text-gray-600">
              {examResult.passed
                ? '你的Excel函数技能已达到认证标准'
                : '继续学习，下次一定能通过！'}
            </p>
          </div>

          <div className="mb-8">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor()}`}>
              {examResult.score}
              <span className="text-2xl text-gray-400">分</span>
            </div>
            <div className="text-gray-600">
              答对 {examResult.answers.filter((a) => a.isCorrect).length} / {examResult.totalQuestions} 题
            </div>
          </div>

          {/* 答题详情 */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-800 mb-3">答题详情</h3>
            <div className="flex justify-center gap-2 flex-wrap">
              {examResult.answers.map((answer, index) => (
                <div
                  key={index}
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    answer.isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                  }`}
                >
                  {index + 1}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-4">
            <button
              onClick={startExam}
              className="flex-1 bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors inline-flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-5 h-5" />
              重新考试
            </button>
            {examResult.passed && (
              <button
                onClick={() => navigate('/certificate')}
                className="flex-1 bg-yellow-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-yellow-600 transition-colors inline-flex items-center justify-center gap-2"
              >
                <Award className="w-5 h-5" />
                查看我的证书
              </button>
            )}
          </div>
        </div>

        {/* 答案解析 */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-800">答案解析</h2>
          {questions.map((question, index) => {
            const answer = examResult.answers.find((a) => a.questionId === question.id)
            const userAnswer = answer?.userAnswer ?? -1
            const isCorrect = answer?.isCorrect ?? false

            return (
              <div key={question.id} className="bg-white rounded-xl shadow-md p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-semibold text-gray-800">
                      第 {index + 1} 题
                    </span>
                    {getDifficultyLabel(question.difficulty)}
                    <span className="text-sm text-gray-500">
                      相关函数：{question.functionName}
                    </span>
                  </div>
                  {isCorrect ? (
                    <span className="flex items-center gap-1 text-green-600 font-medium">
                      <CheckCircle className="w-5 h-5" />
                      正确
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-red-600 font-medium">
                      <XCircle className="w-5 h-5" />
                      错误
                    </span>
                  )}
                </div>

                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {question.question}
                </h3>

                {/* 选项列表 */}
                <div className="space-y-2 mb-4">
                  {question.options.map((option, optionIndex) => {
                    const isCorrectOption = optionIndex === question.correctAnswer
                    const isUserAnswer = optionIndex === userAnswer

                    let optionClass = 'border-gray-200'
                    if (isCorrectOption) {
                      optionClass = 'border-green-500 bg-green-50'
                    } else if (isUserAnswer && !isCorrect) {
                      optionClass = 'border-red-500 bg-red-50'
                    }

                    return (
                      <div
                        key={optionIndex}
                        className={`p-3 rounded-lg border-2 ${optionClass}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-sm font-medium ${
                              isCorrectOption
                                ? 'bg-green-500 text-white'
                                : isUserAnswer && !isCorrect
                                ? 'bg-red-500 text-white'
                                : 'bg-gray-100 text-gray-600'
                            }`}
                          >
                            {String.fromCharCode(65 + optionIndex)}
                          </span>
                          <span className="text-gray-700">{option}</span>
                          {isCorrectOption && (
                            <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
                          )}
                          {isUserAnswer && !isCorrect && (
                            <XCircle className="w-5 h-5 text-red-500 ml-auto" />
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* 答案解析 */}
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-semibold text-blue-800 mb-2">答案解析</h4>
                  <p className="text-blue-700">{question.explanation}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  return null
}

export default ExamPage
