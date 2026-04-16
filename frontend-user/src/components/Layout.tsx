import { ReactNode } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, BookOpen, Heart, GraduationCap, FileText, Award } from 'lucide-react'
import clsx from 'clsx'

interface LayoutProps {
  children: ReactNode
}

const navItems = [
  { path: '/', icon: Home, label: '首页' },
  { path: '/practice', icon: GraduationCap, label: '练习' },
  { path: '/exam', icon: FileText, label: '考试' },
  { path: '/certificate', icon: Award, label: '证书' },
  { path: '/favorites', icon: Heart, label: '收藏' },
]

export default function Layout({ children }: LayoutProps) {
  const location = useLocation()

  return (
    <div className="min-h-screen bg-background">
      {/* 顶部导航 */}
      <header className="bg-primary text-white shadow-lg sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-lg font-bold">Excel函数学习助手</h1>
                <p className="text-xs text-white/70">轻松掌握Excel函数</p>
              </div>
            </Link>

            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.path
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={clsx(
                      'flex items-center gap-2 px-4 py-2 rounded-lg transition-all',
                      isActive
                        ? 'bg-white/20 text-white'
                        : 'text-white/80 hover:bg-white/10 hover:text-white'
                    )}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="hidden sm:inline text-sm font-medium">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        </div>
      </header>

      {/* 主内容区 */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-6">
        {children}
      </main>

      {/* 底部 */}
      <footer className="bg-white border-t border-border mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4">
          <p className="text-center text-sm text-gray-500">
            Excel函数学习助手 - 让Excel学习更简单
          </p>
        </div>
      </footer>
    </div>
  )
}
