import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ToastMessage, UserAnswer, ExamRecord, Certificate } from '../types'

interface AppState {
  // 收藏
  favorites: string[]
  addFavorite: (functionId: string) => void
  removeFavorite: (functionId: string) => void
  isFavorite: (functionId: string) => boolean

  // 练习记录
  userAnswers: UserAnswer[]
  addAnswer: (answer: UserAnswer) => void
  getAnswerByQuestionId: (questionId: string) => UserAnswer | undefined
  clearAnswers: () => void

  // 搜索
  searchQuery: string
  setSearchQuery: (query: string) => void

  // Toast消息
  toasts: ToastMessage[]
  addToast: (toast: Omit<ToastMessage, 'id'>) => void
  removeToast: (id: string) => void

  // 考试记录
  examRecords: ExamRecord[]
  addExamRecord: (record: ExamRecord) => void
  getLatestExamRecord: () => ExamRecord | undefined

  // 证书
  certificates: Certificate[]
  addCertificate: (certificate: Certificate) => void
  getCertificateByExamId: (examId: string) => Certificate | undefined
  hasCertificate: () => boolean
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      // 收藏功能
      favorites: [],
      addFavorite: (functionId: string) => {
        set((state) => ({
          favorites: [...state.favorites, functionId],
        }))
        get().addToast({ type: 'success', message: '已添加到收藏' })
      },
      removeFavorite: (functionId: string) => {
        set((state) => ({
          favorites: state.favorites.filter((id) => id !== functionId),
        }))
        get().addToast({ type: 'info', message: '已取消收藏' })
      },
      isFavorite: (functionId: string) => {
        return get().favorites.includes(functionId)
      },

      // 练习记录
      userAnswers: [],
      addAnswer: (answer: UserAnswer) => {
        set((state) => ({
          userAnswers: [
            ...state.userAnswers.filter((a) => a.questionId !== answer.questionId),
            answer,
          ],
        }))
      },
      getAnswerByQuestionId: (questionId: string) => {
        return get().userAnswers.find((a) => a.questionId === questionId)
      },
      clearAnswers: () => {
        set({ userAnswers: [] })
        get().addToast({ type: 'info', message: '练习记录已清空' })
      },

      // 搜索
      searchQuery: '',
      setSearchQuery: (query: string) => {
        set({ searchQuery: query })
      },

      // Toast消息
      toasts: [],
      addToast: (toast) => {
        const id = Date.now().toString()
        set((state) => ({
          toasts: [...state.toasts, { ...toast, id }],
        }))
        // 自动移除
        setTimeout(() => {
          get().removeToast(id)
        }, toast.duration || 3000)
      },
      removeToast: (id: string) => {
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }))
      },

      // 考试记录
      examRecords: [],
      addExamRecord: (record: ExamRecord) => {
        set((state) => ({
          examRecords: [...state.examRecords, record],
        }))
      },
      getLatestExamRecord: () => {
        const records = get().examRecords
        return records.length > 0 ? records[records.length - 1] : undefined
      },

      // 证书
      certificates: [],
      addCertificate: (certificate: Certificate) => {
        set((state) => ({
          certificates: [...state.certificates, certificate],
        }))
        get().addToast({ type: 'success', message: '恭喜您获得Excel函数技能证书！' })
      },
      getCertificateByExamId: (examId: string) => {
        return get().certificates.find((c) => c.examId === examId)
      },
      hasCertificate: () => {
        return get().certificates.length > 0
      },
    }),
    {
      name: 'excel-helper-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        userAnswers: state.userAnswers,
        examRecords: state.examRecords,
        certificates: state.certificates,
      }),
    }
  )
)
