import { Link } from 'react-router-dom'
import { FunctionCategory } from '../types'
import { Type, Calculator, Calendar, GitBranch, Search } from 'lucide-react'

const iconMap: Record<string, typeof Type> = {
  Type,
  Calculator,
  Calendar,
  GitBranch,
  Search,
}

interface CategoryCardProps {
  category: FunctionCategory
  functionCount: number
}

export default function CategoryCard({ category, functionCount }: CategoryCardProps) {
  const Icon = iconMap[category.icon] || Type

  return (
    <Link
      to={`/category/${category.id}`}
      className="group bg-white rounded-card p-6 shadow-card hover:shadow-card-hover 
                 transition-all duration-300 border border-transparent hover:border-primary/20"
    >
      <div className="flex items-start gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110"
          style={{ backgroundColor: `${category.color}15` }}
        >
          <Icon className="w-6 h-6" style={{ color: category.color }} />
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-800 group-hover:text-primary transition-colors">
            {category.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">
            {category.description}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <span
              className="text-xs font-medium px-2 py-1 rounded-full"
              style={{ backgroundColor: `${category.color}15`, color: category.color }}
            >
              {functionCount} 个函数
            </span>
          </div>
        </div>
      </div>
    </Link>
  )
}
