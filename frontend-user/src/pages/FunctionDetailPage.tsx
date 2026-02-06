import { useParams, Link } from 'react-router-dom'
import { ChevronLeft, Heart, BookOpen, Code, Lightbulb } from 'lucide-react'
import { getFunctionById } from '../data/functions'
import { getCategoryById } from '../data/categories'
import { useStore } from '../store/useStore'
import InteractiveDemo from '../components/InteractiveDemo'
import SpreadSheet from '../components/SpreadSheet'
import clsx from 'clsx'

export default function FunctionDetailPage() {
  const { functionId } = useParams<{ functionId: string }>()
  const func = getFunctionById(functionId || '')
  const { isFavorite, addFavorite, removeFavorite } = useStore()

  if (!func) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">函数不存在</p>
        <Link to="/" className="text-primary hover:underline mt-2 inline-block">
          返回首页
        </Link>
      </div>
    )
  }

  const category = getCategoryById(func.categoryId)
  const favorited = isFavorite(func.id)

  const handleFavoriteClick = () => {
    if (favorited) {
      removeFavorite(func.id)
    } else {
      addFavorite(func.id)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* 返回导航 */}
      <Link
        to={`/category/${func.categoryId}`}
        className="inline-flex items-center gap-1 text-gray-500 hover:text-primary transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        <span className="text-sm">返回{category?.name || '分类'}</span>
      </Link>

      {/* 函数头部 */}
      <div className="bg-white rounded-card p-6 shadow-card">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-gray-800 font-mono">{func.name}</h1>
              {category && (
                <span
                  className="text-xs font-medium px-2 py-1 rounded-full"
                  style={{ backgroundColor: `${category.color}15`, color: category.color }}
                >
                  {category.name}
                </span>
              )}
            </div>
            <p className="text-gray-600">{func.description}</p>
          </div>
          <button
            onClick={handleFavoriteClick}
            className={clsx(
              'p-3 rounded-lg transition-all',
              favorited
                ? 'text-red-500 bg-red-50 hover:bg-red-100'
                : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
            )}
          >
            <Heart className={clsx('w-6 h-6', favorited && 'fill-current')} />
          </button>
        </div>

        {/* 语法 */}
        <div className="mt-6 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Code className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-gray-700">语法</span>
          </div>
          <code className="text-lg font-mono text-primary">{func.syntax}</code>
        </div>

        {/* 返回类型 */}
        <div className="mt-4 flex items-center gap-2">
          <span className="text-sm text-gray-500">返回类型：</span>
          <span className="text-sm font-medium text-gray-700 bg-gray-100 px-2 py-0.5 rounded">
            {func.returnType}
          </span>
        </div>
      </div>

      {/* 参数说明 */}
      <div className="bg-white rounded-card p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <BookOpen className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-800">参数说明</h2>
        </div>
        
        {func.parameters.length > 0 ? (
          <div className="space-y-3">
            {func.parameters.map((param, index) => (
              <div
                key={index}
                className="p-4 bg-gray-50 rounded-lg border-l-4 border-primary"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-mono font-medium text-gray-800">{param.name}</span>
                  <span className={clsx(
                    'text-xs px-2 py-0.5 rounded',
                    param.required
                      ? 'bg-red-100 text-red-600'
                      : 'bg-gray-200 text-gray-600'
                  )}>
                    {param.required ? '必需' : '可选'}
                  </span>
                  <span className="text-xs text-gray-400">({param.type})</span>
                </div>
                <p className="text-sm text-gray-600">{param.description}</p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">该函数不需要参数</p>
        )}
      </div>

      {/* 示例演示 */}
      <div className="bg-white rounded-card p-6 shadow-card">
        <div className="flex items-center gap-2 mb-4">
          <Lightbulb className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-gray-800">示例演示</h2>
        </div>

        <div className="space-y-6">
          {func.examples.map((example, index) => (
            <div key={example.id}>
              {index > 0 && <hr className="my-6 border-gray-200" />}
              
              <h3 className="text-sm font-medium text-gray-700 mb-3">
                示例 {index + 1}: {example.description}
              </h3>

              {/* 静态展示 */}
              <div className="mb-4">
                <p className="text-xs text-gray-500 mb-2">数据预览：</p>
                <SpreadSheet data={example.inputData} />
              </div>

              <div className="p-3 bg-green-50 rounded-lg mb-4">
                <p className="text-sm">
                  <span className="font-medium text-green-800">预期结果：</span>
                  <span className="ml-2 text-green-600 font-semibold">{example.expectedResult}</span>
                </p>
              </div>

              {/* 交互演示 */}
              <InteractiveDemo example={example} />
            </div>
          ))}
        </div>
      </div>

      {/* 使用提示 */}
      <div className="bg-blue-50 rounded-card p-6 border border-blue-100">
        <h3 className="text-sm font-semibold text-blue-800 mb-2">💡 使用提示</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• 在交互演示中修改单元格数据，点击"计算"查看结果</li>
          <li>• 点击"重置"可以恢复初始数据</li>
          <li>• 收藏常用函数，方便下次快速查找</li>
        </ul>
      </div>
    </div>
  )
}
