import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { FileQuestion, CheckCircle, XCircle, Award, Clock, ChevronRight, RotateCcw } from 'lucide-react'
import { ExamQuestion, ExamRecord, Certificate, ExamAnswer } from '../types'
import { getRandomExamQuestions } from '../data/examQuestions'
import { useStore } from '../store/useStore'

const ExamPage = () => {
  const navigate = useNavigate()
  const addExamRecord = useStore((state) => state.addExamRecord)
  const addCertificate = useStore((state) => state.addCertificate)
  const examRecords = useStore((state) => state.examRecords)
  const addToast = useStore((state) => state.addToast)

  const [examState, setExamState] = useState<'welcome' | 'examining' | 'result'>('welcome')
  const [questions, setQuestions] = useState<ExamQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [userAnswers, setUserAnswers] = useState<Record<string, number>>({})
  const [examResult, setExamResult] = useState<ExamRecord | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [userName, setUserName] = useState('学员')

  const PASS_SCORE = 60
  const TOTAL_QUESTIONS = 10

  const startExam = () => {
    const randomQuestions = getRandomExamQuestions(TOTAL_QUESTIONS)
    setQuestions(randomQuestions)
    setCurrentIndex(0)
    setUserAnswers({})
    setExamState('examining')
    setShowExplanation(false)
  }

  const selectAnswer = (questionId: string, answerIndex: number) => {
    setUserAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const submitExam = () => {
    let correctCount = 0
    const answers: ExamAnswer[] = []

    questions.forEach((question) => {
      const userAnswer = userAnswers[question.id]
      const isCorrect = userAnswer === question.correctAnswer
      if (isCorrect) correctCount++
      answers.push({
        questionId: question.id,
        userAnswer: userAnswer ?? -1,
        isCorrect,
      })
    })

    const score = Math.round((correctCount / TOTAL_QUESTIONS) * 100)
    const passed = score >= PASS_SCORE

    const examRecord: ExamRecord = {
      id: Date.now().toString(),
      score,
      totalQuestions: TOTAL_QUESTIONS,
      correctCount,
      passed,
      examDate: new Date(),
      answers,
    }

    setExamResult(examRecord)
    addExamRecord(examRecord)

    if (passed) {
      const level = score >= 90 ? '高级' : score >= 75 ? '中级' : '初级'
      const certificate: Certificate = {
        id: Date.now().toString(),
        certificateNumber: `EXCEL-${Date.now().toString().slice(-8)}`,
        userName,
        score,
        issueDate: new Date(),
        examId: examRecord.id,
        level,
      }
      addCertificate(certificate)
    } else {
      addToast({ type: 'warning', message: `很遗憾，您的分数是${score}分，未通过考试，请继续努力！` })
    }

    setExamState('result')
  }

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevQuestion = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const viewCertificate = () => {
    navigate('/certificate')
  }

  const currentQuestion = questions[currentIndex]
  const answeredCount = Object.keys(userAnswers).length

  if (examState === 'welcome') {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileQuestion className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Excel函数技能认证考试</h1>
          <p className="text-gray-600 mb-6">
            本考试包含{TOTAL_QUESTIONS}道选择题，满分100分，{PASS_SCORE}分及以上可获得证书。
          </p>

          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-700 mb-4">考试规则</h3>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                题目随机抽取，每次考试题目不同
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                考试过程中可随时返回修改答案
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                提交后立即显示成绩和答案解析
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                通过考试即可获得电子证书
              </li>
            </ul>
          </div>

          {examRecords.length > 0 && (
            <div className="bg-blue-50 rounded-xl p-4 mb-6">
              <p className="text-blue-700">
                您已参加过 {examRecords.length} 次考试，
                最高分：{Math.max(...examRecords.map((r) => r.score))} 分
              </p>
            </div>
          )}

          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2 text-left">
              您的姓名（将显示在证书上）
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              placeholder="请输入您的姓名"
            />
          </div>

          <button
            onClick={startExam}
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            开始考试
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    )
  }

  if (examState === 'examining' && currentQuestion) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          <div className="bg-primary text-white p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                第 {currentIndex + 1} / {questions.length} 题
              </span>
              <span>已答题：{answeredCount}/{questions.length}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2">
              <div
                className="bg-white h-2 rounded-full transition-all"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>

          <div className="p-6">
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  currentQuestion.difficulty === 1 ? 'bg-green-100 text-green-700' :
                  currentQuestion.difficulty === 2 ? 'bg-yellow-100 text-yellow-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {currentQuestion.difficulty === 1 ? '简单' : currentQuestion.difficulty === 2 ? '中等' : '困难'}
                </span>
                <span className="text-sm text-gray-500">
                  相关函数：{currentQuestion.functionName}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">
                {currentQuestion.question}
              </h2>
            </div>

            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => selectAnswer(currentQuestion.id, index)}
                  className={`w-full p-4 rounded-xl text-left transition-all border-2 ${
                    userAnswers[currentQuestion.id] === index
                      ? 'border-primary bg-primary/5'
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      userAnswers[currentQuestion.id] === index
                        ? 'bg-primary text-white'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {String.fromCharCode(65 + index)}
                    </span>
                    <span className="text-gray-700">{option}</span>
                  </div>
                </button>
              ))}
            </div>

            <div className="flex justify-between">
              <button
                onClick={prevQuestion}
                disabled={currentIndex === 0}
                className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一题
              </button>

              {currentIndex === questions.length - 1 ? (
                <button
                  onClick={submitExam}
                  disabled={answeredCount < questions.length}
                  className="px-6 py-3 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  提交试卷
                </button>
              ) : (
                <button
                  onClick={nextQuestion}
                  className="px-6 py-3 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-colors flex items-center gap-2"
                >
                  下一题
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4 bg-white rounded-xl p-4 shadow">
          <h3 className="font-semibold text-gray-700 mb-3">答题卡</h3>
          <div className="flex flex-wrap gap-2">
            {questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentIndex(index)}
                className={`w-10 h-10 rounded-lg font-medium transition-all ${
                  userAnswers[q.id] !== undefined
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    )
  }

  if (examState === 'result' && examResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${
            examResult.passed ? 'bg-green-100' : 'bg-red-100'
          }`}>
            {examResult.passed ? (
              <Award className="w-12 h-12 text-green-600" />
            ) : (
              <XCircle className="w-12 h-12 text-red-600" />
            )}
          </div>

          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            {examResult.passed ? '恭喜您通过考试！' : '很遗憾，未能通过考试'}
          </h1>

          <div className="my-8">
            <div className="text-6xl font-bold text-primary mb-2">{examResult.score}</div>
            <p className="text-gray-500">满分100分，及格线{PASS_SCORE}分</p>
          </div>

          <div className="grid grid-cols-3 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-gray-800">{examResult.totalQuestions}</div>
              <p className="text-sm text-gray-500">总题数</p>
            </div>
            <div className="bg-green-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-green-600">{examResult.correctCount}</div>
              <p className="text-sm text-gray-500">正确数</p>
            </div>
            <div className="bg-red-50 rounded-xl p-4">
              <div className="text-2xl font-bold text-red-600">
                {examResult.totalQuestions - examResult.correctCount}
              </div>
              <p className="text-sm text-gray-500">错误数</p>
            </div>
          </div>

          {examResult.passed && (
            <button
              onClick={viewCertificate}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 text-white py-4 rounded-xl font-semibold text-lg hover:from-yellow-600 hover:to-orange-600 transition-all flex items-center justify-center gap-2 mb-4"
            >
              <Award className="w-5 h-5" />
              查看我的证书
            </button>
          )}

          <button
            onClick={startExam}
            className="w-full bg-primary text-white py-4 rounded-xl font-semibold text-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-5 h-5" />
            重新考试
          </button>
        </div>

        <button
          onClick={() => setShowExplanation(!showExplanation)}
          className="w-full mt-4 bg-white rounded-xl p-4 shadow text-left flex items-center justify-between"
        >
          <span className="font-semibold text-gray-700">查看答案解析</span>
          <ChevronRight className={`w-5 h-5 text-gray-400 transition-transform ${showExplanation ? 'rotate-90' : ''}`} />
        </button>

        {showExplanation && (
          <div className="mt-4 space-y-4">
            {questions.map((question, index) => {
              const userAnswer = userAnswers[question.id]
              const isCorrect = userAnswer === question.correctAnswer
              return (
                <div key={question.id} className="bg-white rounded-xl p-6 shadow">
                  <div className="flex items-start gap-3 mb-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex-shrink-0 ${
                      isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {isCorrect ? (
                        <CheckCircle className="w-4 h-4 inline mr-1" />
                      ) : (
                        <XCircle className="w-4 h-4 inline mr-1" />
                      )}
                      {isCorrect ? '正确' : '错误'}
                    </span>
                    <span className="text-gray-600">第 {index + 1} 题</span>
                  </div>
                  <p className="font-semibold text-gray-800 mb-3">{question.question}</p>
                  <div className="space-y-2 mb-4">
                    {question.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-lg ${
                          optIndex === question.correctAnswer
                            ? 'bg-green-100 border-2 border-green-500'
                            : userAnswer === optIndex
                            ? 'bg-red-100 border-2 border-red-500'
                            : 'bg-gray-50'
                        }`}
                      >
                        <span className="font-medium mr-2">{String.fromCharCode(65 + optIndex)}.</span>
                        {option}
                        {optIndex === question.correctAnswer && (
                          <span className="ml-2 text-green-600 text-sm">✓ 正确答案</span>
                        )}
                        {userAnswer === optIndex && !isCorrect && (
                          <span className="ml-2 text-red-600 text-sm">✗ 您的选择</span>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700">
                      <span className="font-semibold">解析：</span>{question.explanation}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  return null
}

export default ExamPage
