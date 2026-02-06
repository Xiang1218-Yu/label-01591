import { useParams, Link } from 'react-router-dom'
import { ChevronLeft } from 'lucide-react'
import { Type, Calculator, Calendar, GitBranch, Search } from 'lucide-react'
import FunctionCard from '../components/FunctionCard'
import { getCategoryById } from '../data/categories'
import { getFunctionsByCategory } from '../data/functions'

const iconMap: Record<string, typeof Type> = {
  Type,
  Calculator,
  Calendar,
  GitBranch,
  Search,
}

export default function CategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const category = getCategoryById(categoryId || '')
  const functions = getFunctionsByCategory(categoryId || '')

  if (!category) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">分类不存在</p>
        <Link to="/" className="text-primary hover:underline mt-2 inline-block">
          返回首页
        </Link>
      </div>
    )
  }

  const Icon = iconMap[category.icon] || Type

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 返回导航 */}
      <Link
        to="/"
        className="inline-flex items-center gap-1 text-gray-500 hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">返回首页</span>
      </Link>

      {/* 分类头部 */}
      <div className="bg-white rounded-card p-6 shadow-card">
        <div className="flex items-center gap-4">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${category.color}15` }}
          >
            <Icon className="w-8 h-8" style={{ color: category.color }} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-800">{category.name}</h1>
            <p className="text-gray-500 mt-1">{category.description}</p>
            <span
              className="text-sm font-medium px-3 py-1 rounded-full mt-2 inline-block"
              style={{ backgroundColor: `${category.color}15`, color: category.color }}
            >
              共 {functions.length} 个函数
            </span>
          </div>
        </div>
      </div>

      {/* 函数列表 */}
      <div className="space-y-3">
        {functions.map((func) => (
          <FunctionCard key={func.id} func={func} />
        ))}
      </div>

      {functions.length === 0 && (
        <div className="bg-white rounded-card p-8 text-center shadow-card">
          <p className="text-gray-500">该分类暂无函数</p>
        </div>
      )}
    </div>
  )
}
