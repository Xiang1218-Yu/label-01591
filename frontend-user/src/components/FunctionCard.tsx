import { Link } from 'react-router-dom'
import { Heart, ChevronRight } from 'lucide-react'
import { ExcelFunction } from '../types'
import { useStore } from '../store/useStore'
import clsx from 'clsx'

interface FunctionCardProps {
  func: ExcelFunction
  showCategory?: boolean
}

export default function FunctionCard({ func, showCategory = false }: FunctionCardProps) {
  const { isFavorite, addFavorite, removeFavorite } = useStore()
  const favorited = isFavorite(func.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (favorited) {
      removeFavorite(func.id)
    } else {
      addFavorite(func.id)
    }
  }

  return (
    <Link
      to={`/function/${func.id}`}
      className="group bg-white rounded-card p-4 shadow-card hover:shadow-card-hover 
                 transition-all duration-300 border border-transparent hover:border-primary/20
                 flex items-center gap-4"
    >
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="text-base font-semibold text-gray-800 group-hover:text-primary transition-colors font-mono">
            {func.name}
          </h3>
          {showCategory && (
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded">
              {func.categoryId}
            </span>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1 truncate">
          {func.description}
        </p>
        <code className="text-xs text-primary/80 bg-primary/5 px-2 py-1 rounded mt-2 inline-block font-mono">
          {func.syntax}
        </code>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={handleFavoriteClick}
          className={clsx(
            'p-2 rounded-lg transition-all',
            favorited
              ? 'text-red-500 bg-red-50 hover:bg-red-100'
              : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
          )}
        >
          <Heart className={clsx('w-5 h-5', favorited && 'fill-current')} />
        </button>
        <ChevronRight className="w-5 h-5 text-gray-300 group-hover:text-primary transition-colors" />
      </div>
    </Link>
  )
}
