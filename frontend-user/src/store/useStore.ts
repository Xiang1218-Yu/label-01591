import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { ToastMessage, UserAnswer } from '../types'

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
    }),
    {
      name: 'excel-helper-storage',
      partialize: (state) => ({
        favorites: state.favorites,
        userAnswers: state.userAnswers,
      }),
    }
  )
)
