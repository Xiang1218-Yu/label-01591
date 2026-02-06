import { useState, useMemo } from 'react'
import { GraduationCap, CheckCircle, XCircle, Lightbulb, RotateCcw, Trophy } from 'lucide-react'
import { practiceQuestions } from '../data/practices'
import { useStore } from '../store/useStore'
import { PracticeQuestion } from '../types'
import clsx from 'clsx'

export default function PracticePage() {
  const [selectedDifficulty, setSelectedDifficulty] = useState<number | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [showAnswer, setShowAnswer] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const { userAnswers, addAnswer, clearAnswers } = useStore()

  const filteredQuestions = useMemo(() => {
    if (selectedDifficulty === null) return practiceQuestions
    return practiceQuestions.filter(q => q.difficulty === selectedDifficulty)
  }, [selectedDifficulty])

  const currentQuestion: PracticeQuestion | undefined = filteredQuestions[currentQuestionIndex]

  const stats = useMemo(() => {
    const answered = userAnswers.length
    const correct = userAnswers.filter(a => a.isCorrect).length
    return { answered, correct, total: practiceQuestions.length }
  }, [userAnswers])

  const normalizeAnswer = (answer: string): string => {
    return answer
      .toUpperCase()
      .replace(/\s+/g, '')
      .replace(/，/g, ',')
      .replace(/"/g, '"')
      .replace(/"/g, '"')
  }

  const checkAnswer = (userAnswer: string, correctAnswer: string): boolean => {
    return normalizeAnswer(userAnswer) === normalizeAnswer(correctAnswer)
  }

  const handleSubmit = () => {
    if (!currentQuestion || !userInput.trim()) return

    const isCorrect = checkAnswer(userInput, currentQuestion.answer)
    addAnswer({
      questionId: currentQuestion.id,
      userAnswer: userInput,
      isCorrect,
      answeredAt: new Date(),
    })
    setIsSubmitted(true)
  }

  const handleNext = () => {
    if (currentQuestionIndex < filteredQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      resetQuestion()
    }
  }

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1)
      resetQuestion()
    }
  }

  const resetQuestion = () => {
    setUserInput('')
    setShowHint(false)
    setShowAnswer(false)
    setIsSubmitted(false)
  }

  const handleReset = () => {
    clearAnswers()
    setCurrentQuestionIndex(0)
    resetQuestion()
  }

  const difficultyLabels = ['', '入门', '进阶', '挑战']
  const difficultyColors = ['', 'bg-green-100 text-green-700', 'bg-yellow-100 text-yellow-700', 'bg-red-100 text-red-700']

  const previousAnswer = currentQuestion 
    ? userAnswers.find(a => a.questionId === currentQuestion.id)
    : undefined

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-800">函数练习</h1>
            <p className="text-sm text-gray-500">通过练习巩固所学知识</p>
          </div>
        </div>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 
                     bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          重置进度
        </button>
      </div>

      {/* 统计卡片 */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-card p-4 shadow-card">
          <p className="text-sm text-gray-500">已答题</p>
          <p className="text-2xl font-bold text-gray-800">{stats.answered}</p>
        </div>
        <div className="bg-white rounded-card p-4 shadow-card">
          <p className="text-sm text-gray-500">正确数</p>
          <p className="text-2xl font-bold text-green-600">{stats.correct}</p>
        </div>
        <div className="bg-white rounded-card p-4 shadow-card">
          <p className="text-sm text-gray-500">正确率</p>
          <p className="text-2xl font-bold text-primary">
            {stats.answered > 0 ? Math.round((stats.correct / stats.answered) * 100) : 0}%
          </p>
        </div>
      </div>

      {/* 难度筛选 */}
      <div className="bg-white rounded-card p-4 shadow-card">
        <p className="text-sm font-medium text-gray-700 mb-3">选择难度：</p>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => { setSelectedDifficulty(null); setCurrentQuestionIndex(0); resetQuestion() }}
            className={clsx(
              'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
              selectedDifficulty === null
                ? 'bg-primary text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            )}
          >
            全部 ({practiceQuestions.length})
          </button>
          {[1, 2, 3].map((level) => {
            const count = practiceQuestions.filter(q => q.difficulty === level).length
            return (
              <button
                key={level}
                onClick={() => { setSelectedDifficulty(level); setCurrentQuestionIndex(0); resetQuestion() }}
                className={clsx(
                  'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                  selectedDifficulty === level
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                )}
              >
                {difficultyLabels[level]} ({count})
              </button>
            )
          })}
        </div>
      </div>

      {/* 题目区域 */}
      {currentQuestion ? (
        <div className="bg-white rounded-card p-6 shadow-card">
          {/* 题目头部 */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-500">
                第 {currentQuestionIndex + 1} / {filteredQuestions.length} 题
              </span>
              <span className={clsx(
                'text-xs px-2 py-1 rounded-full font-medium',
                difficultyColors[currentQuestion.difficulty]
              )}>
                {difficultyLabels[currentQuestion.difficulty]}
              </span>
            </div>
            <span className="text-sm font-mono text-primary bg-primary/10 px-2 py-1 rounded">
              {currentQuestion.functionName}
            </span>
          </div>

          {/* 题目内容 */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-800 mb-4">
              {currentQuestion.question}
            </h3>

            {/* 答题输入 */}
            <div className="space-y-3">
              <input
                type="text"
                value={userInput}
                onChange={(e) => setUserInput(e.target.value)}
                placeholder="输入你的答案，如 =SUM(A1:A5)"
                disabled={isSubmitted}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg font-mono
                           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                           disabled:bg-gray-50 disabled:text-gray-500"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isSubmitted) {
                    handleSubmit()
                  }
                }}
              />

              {/* 提示按钮 */}
              {!isSubmitted && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowHint(!showHint)}
                    className="flex items-center gap-1 text-sm text-yellow-600 hover:text-yellow-700"
                  >
                    <Lightbulb className="w-4 h-4" />
                    {showHint ? '隐藏提示' : '显示提示'}
                  </button>
                  <button
                    onClick={() => setShowAnswer(!showAnswer)}
                    className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700"
                  >
                    {showAnswer ? '隐藏答案' : '查看答案'}
                  </button>
                </div>
              )}

              {/* 提示内容 */}
              {showHint && !isSubmitted && (
                <div className="p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                  <p className="text-sm text-yellow-700">
                    <span className="font-medium">提示：</span> {currentQuestion.hint}
                  </p>
                </div>
              )}

              {/* 答案内容 */}
              {showAnswer && !isSubmitted && (
                <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">
                    <span className="font-medium">参考答案：</span>
                    <code className="ml-2 font-mono text-primary">{currentQuestion.answer}</code>
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 提交结果 */}
          {isSubmitted && (
            <div className={clsx(
              'p-4 rounded-lg mb-6',
              previousAnswer?.isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            )}>
              <div className="flex items-center gap-2 mb-2">
                {previousAnswer?.isCorrect ? (
                  <>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="font-medium text-green-700">回答正确！</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-500" />
                    <span className="font-medium text-red-700">回答错误</span>
                  </>
                )}
              </div>
              <p className="text-sm text-gray-600">
                <span className="font-medium">你的答案：</span>
                <code className="ml-2 font-mono">{userInput}</code>
              </p>
              <p className="text-sm text-gray-600 mt-1">
                <span className="font-medium">正确答案：</span>
                <code className="ml-2 font-mono text-green-600">{currentQuestion.answer}</code>
              </p>
            </div>
          )}

          {/* 操作按钮 */}
          <div className="flex items-center justify-between">
            <button
              onClick={handlePrev}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg 
                         hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              上一题
            </button>

            <div className="flex gap-2">
              {!isSubmitted ? (
                <button
                  onClick={handleSubmit}
                  disabled={!userInput.trim()}
                  className="px-6 py-2 text-sm text-white bg-primary rounded-lg 
                             hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  提交答案
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={currentQuestionIndex === filteredQuestions.length - 1}
                  className="px-6 py-2 text-sm text-white bg-primary rounded-lg 
                             hover:bg-primary-light disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  下一题
                </button>
              )}
            </div>

            <button
              onClick={handleNext}
              disabled={currentQuestionIndex === filteredQuestions.length - 1}
              className="px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-lg 
                         hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              下一题
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-card p-8 text-center shadow-card">
          <Trophy className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-500">该难度暂无练习题</p>
        </div>
      )}

      {/* 完成提示 */}
      {stats.answered === filteredQuestions.length && filteredQuestions.length > 0 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-card p-6 border border-yellow-200">
          <div className="flex items-center gap-4">
            <Trophy className="w-12 h-12 text-yellow-500" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-800">恭喜完成所有练习！</h3>
              <p className="text-sm text-yellow-700 mt-1">
                你已完成 {stats.answered} 道题目，正确 {stats.correct} 道，正确率 {Math.round((stats.correct / stats.answered) * 100)}%
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
