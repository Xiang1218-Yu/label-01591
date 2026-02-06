import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { Sparkles, TrendingUp, BookOpen } from 'lucide-react'
import SearchBar from '../components/SearchBar'
import CategoryCard from '../components/CategoryCard'
import FunctionCard from '../components/FunctionCard'
import { categories } from '../data/categories'
import { excelFunctions, searchFunctions, getFunctionsByCategory } from '../data/functions'
import { useStore } from '../store/useStore'

export default function HomePage() {
  const { searchQuery } = useStore()

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return []
    return searchFunctions(searchQuery)
  }, [searchQuery])

  const popularFunctions = useMemo(() => {
    return excelFunctions.filter(fn => 
      ['sum', 'if', 'vlookup', 'concat', 'average'].includes(fn.id)
    )
  }, [])

  const isSearching = searchQuery.trim().length > 0

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero区域 */}
      <section className="bg-gradient-to-br from-primary to-primary-dark rounded-2xl p-8 text-white">
        <div className="max-w-2xl">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-6 h-6" />
            <span className="text-sm font-medium bg-white/20 px-3 py-1 rounded-full">
              交互式学习
            </span>
          </div>
          <h1 className="text-3xl font-bold mb-4">
            轻松掌握Excel函数
          </h1>
          <p className="text-white/80 mb-6">
            通过交互式演示和练习，让你快速理解和掌握Excel中最常用的函数。
            无论你是初学者还是想要提升技能，这里都能帮到你。
          </p>
          <div className="max-w-md">
            <SearchBar placeholder="搜索函数名称或功能..." />
          </div>
        </div>
      </section>

      {/* 搜索结果 */}
      {isSearching && (
        <section>
          <h2 className="text-lg font-semibold text-gray-800 mb-4">
            搜索结果 ({searchResults.length})
          </h2>
          {searchResults.length > 0 ? (
            <div className="grid gap-3">
              {searchResults.map((func) => (
                <FunctionCard key={func.id} func={func} showCategory />
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-card p-8 text-center shadow-card">
              <p className="text-gray-500">没有找到匹配的函数</p>
              <p className="text-sm text-gray-400 mt-2">
                试试其他关键词，如 "求和"、"查找"、"日期" 等
              </p>
            </div>
          )}
        </section>
      )}

      {/* 非搜索状态显示分类和热门 */}
      {!isSearching && (
        <>
          {/* 函数分类 */}
          <section>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-lg font-semibold text-gray-800">函数分类</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <CategoryCard
                  key={category.id}
                  category={category}
                  functionCount={getFunctionsByCategory(category.id).length}
                />
              ))}
            </div>
          </section>

          {/* 热门函数 */}
          <section>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-gray-800">热门函数</h2>
              </div>
              <Link
                to="/category/math"
                className="text-sm text-primary hover:text-primary-light transition-colors"
              >
                查看更多 →
              </Link>
            </div>
            <div className="grid gap-3">
              {popularFunctions.map((func) => (
                <FunctionCard key={func.id} func={func} />
              ))}
            </div>
          </section>

          {/* 快速入门提示 */}
          <section className="bg-white rounded-card p-6 shadow-card">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">💡 快速入门</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-800 mb-2">1. 选择分类</h4>
                <p className="text-sm text-blue-600">
                  根据你的需求选择函数分类，如文本、数学、日期等
                </p>
              </div>
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-medium text-green-800 mb-2">2. 交互演示</h4>
                <p className="text-sm text-green-600">
                  在模拟表格中修改数据，实时查看函数计算结果
                </p>
              </div>
              <div className="p-4 bg-purple-50 rounded-lg">
                <h4 className="font-medium text-purple-800 mb-2">3. 练习巩固</h4>
                <p className="text-sm text-purple-600">
                  通过练习题检验学习成果，加深理解
                </p>
              </div>
            </div>
          </section>
        </>
      )}
    </div>
  )
}
