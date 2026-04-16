import { Award, Lock, Trophy, Medal } from 'lucide-react'
import CertificateCard from '../components/CertificateCard'
import { useStore } from '../store/useStore'
import { Link } from 'react-router-dom'

// 证书页面组件
const CertificatePage = () => {
  const certificates = useStore((state) => state.certificates)
  const hasCertificate = useStore((state) => state.hasCertificate)
  const bestExamRecord = useStore((state) => state.getBestExamRecord())

  // 证书等级配置
  const certificateLevels = [
    {
      level: 'bronze' as const,
      name: '青铜证书',
      description: '掌握Excel基础函数，具备日常数据处理能力',
      requirement: '考试成绩达到60分及以上',
      icon: Medal,
      color: '#CD7F32',
    },
    {
      level: 'silver' as const,
      name: '白银证书',
      description: '熟练掌握常用函数，能够解决复杂数据问题',
      requirement: '考试成绩达到80分及以上',
      icon: Trophy,
      color: '#C0C0C0',
    },
    {
      level: 'gold' as const,
      name: '黄金证书',
      description: '精通Excel高级函数，成为数据处理专家',
      requirement: '考试成绩达到95分及以上',
      icon: Award,
      color: '#FFD700',
    },
  ]

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <Award className="w-16 h-16 mx-auto text-blue-600 mb-4" />
        <h1 className="text-3xl font-bold text-gray-800 mb-2">我的证书</h1>
        <p className="text-gray-600">展示你获得的Excel函数技能认证</p>
      </div>

      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-blue-600 mb-1">{certificates.length}</div>
          <div className="text-gray-600">已获得证书</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-green-600 mb-1">
            {bestExamRecord ? `${bestExamRecord.score}分` : '-'}
          </div>
          <div className="text-gray-600">最高分数</div>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-md text-center">
          <div className="text-3xl font-bold text-orange-600 mb-1">
            {certificates.some((c) => c.level === 'gold')
              ? '黄金'
              : certificates.some((c) => c.level === 'silver')
              ? '白银'
              : certificates.some((c) => c.level === 'bronze')
              ? '青铜'
              : '无'}
          </div>
          <div className="text-gray-600">当前等级</div>
        </div>
      </div>

      {/* 证书展示区域 */}
      <div className="mb-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">已获得证书</h2>
        {certificates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certificates
              .sort((a, b) => {
                const levelOrder = { gold: 3, silver: 2, bronze: 1 }
                return levelOrder[b.level] - levelOrder[a.level]
              })
              .map((certificate) => (
                <CertificateCard key={certificate.id} certificate={certificate} />
              ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl p-12 shadow-md text-center">
            <Award className="w-16 h-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">暂无证书</h3>
            <p className="text-gray-500 mb-6">参加考试并达到分数线即可获得证书</p>
            <Link
              to="/exam"
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <Trophy className="w-5 h-5" />
              立即参加考试
            </Link>
          </div>
        )}
      </div>

      {/* 证书等级说明 */}
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">证书等级说明</h2>
        <div className="space-y-6">
          {certificateLevels.map((level) => {
            const isUnlocked = hasCertificate(level.level)

            return (
              <div
                key={level.level}
                className={`flex gap-6 p-6 rounded-xl border-2 transition-all ${
                  isUnlocked
                    ? 'border-green-200 bg-green-50'
                    : 'border-gray-200 bg-gray-50 opacity-60'
                }`}
              >
                <div
                  className={`w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0 ${
                    isUnlocked ? '' : 'grayscale'
                  }`}
                  style={{ backgroundColor: `${level.color}20` }}
                >
                  {isUnlocked ? (
                    <level.icon size={32} style={{ color: level.color }} />
                  ) : (
                    <Lock size={32} className="text-gray-400" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{level.name}</h3>
                    {isUnlocked ? (
                      <span className="px-3 py-1 bg-green-100 text-green-700 text-sm font-medium rounded-full">
                        已获得
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-gray-200 text-gray-600 text-sm font-medium rounded-full">
                        未获得
                      </span>
                    )}
                  </div>
                  <p className="text-gray-600 mb-2">{level.description}</p>
                  <p className="text-sm text-gray-500">
                    <span className="font-medium">获取条件：</span>
                    {level.requirement}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default CertificatePage
