import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ToastMessage, UserAnswer, ExamRecord, Certificate, CERTIFICATE_LEVELS } from '../types'

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
  getBestExamRecord: () => ExamRecord | undefined

  // 证书
  certificates: Certificate[]
  addCertificate: (certificate: Certificate) => void
  getCertificateByLevel: (level: 'bronze' | 'silver' | 'gold') => Certificate | undefined
  hasCertificate: (level: 'bronze' | 'silver' | 'gold') => boolean
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

      // 考试记录功能
      examRecords: [],
      addExamRecord: (record: ExamRecord) => {
        set((state) => ({
          examRecords: [...state.examRecords, record],
        }))
        // 根据分数自动颁发证书
        const score = record.score
        let certificateLevel: 'bronze' | 'silver' | 'gold' | null = null

        if (score >= CERTIFICATE_LEVELS.gold.minScore && !get().hasCertificate('gold')) {
          certificateLevel = 'gold'
        } else if (score >= CERTIFICATE_LEVELS.silver.minScore && !get().hasCertificate('silver')) {
          certificateLevel = 'silver'
        } else if (score >= CERTIFICATE_LEVELS.bronze.minScore && !get().hasCertificate('bronze')) {
          certificateLevel = 'bronze'
        }

        if (certificateLevel) {
          const certificate: Certificate = {
            id: Date.now().toString(),
            examRecordId: record.id,
            score: score,
            level: certificateLevel,
            issuedAt: new Date(),
            certificateNumber: `EXCEL-${certificateLevel.toUpperCase()}-${Date.now().toString().slice(-8)}`,
          }
          get().addCertificate(certificate)
          get().addToast({
            type: 'success',
            message: `恭喜！获得${CERTIFICATE_LEVELS[certificateLevel].name}！`,
            duration: 5000,
          })
        }
      },
      getLatestExamRecord: () => {
        const records = get().examRecords
        return records.length > 0 ? records[records.length - 1] : undefined
      },
      getBestExamRecord: () => {
        const records = get().examRecords
        return records.length > 0
          ? records.reduce((best, current) => (current.score > best.score ? current : best), records[0])
          : undefined
      },

      // 证书功能
      certificates: [],
      addCertificate: (certificate: Certificate) => {
        set((state) => ({
          certificates: [...state.certificates, certificate],
        }))
      },
      getCertificateByLevel: (level: 'bronze' | 'silver' | 'gold') => {
        return get().certificates.find((c) => c.level === level)
      },
      hasCertificate: (level: 'bronze' | 'silver' | 'gold') => {
        return get().certificates.some((c) => c.level === level)
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
