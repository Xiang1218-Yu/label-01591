import { useMemo } from 'react'
import { Heart, Inbox } from 'lucide-react'
import { Link } from 'react-router-dom'
import FunctionCard from '../components/FunctionCard'
import { useStore } from '../store/useStore'
import { excelFunctions } from '../data/functions'

export default function FavoritesPage() {
  const { favorites } = useStore()

  const favoriteFunctions = useMemo(() => {
    return excelFunctions.filter(fn => favorites.includes(fn.id))
  }, [favorites])

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 页面标题 */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
          <Heart className="w-6 h-6 text-red-500" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">我的收藏</h1>
          <p className="text-sm text-gray-500">
            已收藏 {favorites.length} 个函数
          </p>
        </div>
      </div>

      {/* 收藏列表 */}
      {favoriteFunctions.length > 0 ? (
        <div className="space-y-3">
          {favoriteFunctions.map((func) => (
            <FunctionCard key={func.id} func={func} showCategory />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-card p-12 text-center shadow-card">
          <Inbox className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">暂无收藏</h3>
          <p className="text-sm text-gray-400 mb-6">
            浏览函数时点击 ❤️ 即可添加到收藏
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-2 text-sm text-white 
                       bg-primary rounded-lg hover:bg-primary-light transition-colors"
          >
            去浏览函数
          </Link>
        </div>
      )}

      {/* 提示 */}
      {favoriteFunctions.length > 0 && (
        <div className="bg-blue-50 rounded-card p-4 border border-blue-100">
          <p className="text-sm text-blue-700">
            💡 收藏的函数会保存在本地，方便你随时查阅复习
          </p>
        </div>
      )}
    </div>
  )
}
