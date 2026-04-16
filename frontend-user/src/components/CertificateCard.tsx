import { Award } from 'lucide-react'
import { Certificate, CERTIFICATE_LEVELS } from '../types'

interface CertificateCardProps {
  certificate: Certificate
}

// 证书卡片组件
const CertificateCard = ({ certificate }: CertificateCardProps) => {
  const levelInfo = CERTIFICATE_LEVELS[certificate.level]
  const issuedDate = new Date(certificate.issuedAt).toLocaleDateString('zh-CN')

  // 根据证书等级获取样式
  const getLevelStyles = () => {
    switch (certificate.level) {
      case 'gold':
        return {
          bg: 'bg-gradient-to-br from-yellow-100 to-yellow-200',
          border: 'border-yellow-500',
          text: 'text-yellow-700',
          shadow: 'shadow-yellow-200',
        }
      case 'silver':
        return {
          bg: 'bg-gradient-to-br from-gray-100 to-gray-200',
          border: 'border-gray-400',
          text: 'text-gray-700',
          shadow: 'shadow-gray-200',
        }
      case 'bronze':
        return {
          bg: 'bg-gradient-to-br from-orange-100 to-orange-200',
          border: 'border-orange-500',
          text: 'text-orange-700',
          shadow: 'shadow-orange-200',
        }
    }
  }

  const styles = getLevelStyles()

  return (
    <div
      className={`relative p-8 rounded-2xl border-4 ${styles.bg} ${styles.border} shadow-lg ${styles.shadow} transform hover:scale-105 transition-all duration-300`}
    >
      {/* 装饰角标 */}
      <div className="absolute top-0 right-0 w-16 h-16 overflow-hidden">
        <div
          className="absolute transform rotate-45 text-white text-xs font-bold py-1 right-[-32px] top-[20px] w-[140px] text-center"
          style={{ backgroundColor: levelInfo.color }}
        >
          {certificate.level.toUpperCase()}
        </div>
      </div>

      {/* 证书图标 */}
      <div className="text-center mb-4">
        <Award size={64} className="mx-auto" style={{ color: levelInfo.color }} />
      </div>

      {/* 证书标题 */}
      <h3 className={`text-2xl font-bold text-center mb-2 ${styles.text}`}>
        {levelInfo.name}
      </h3>

      {/* 证书副标题 */}
      <p className="text-center text-gray-600 mb-6">
        Excel函数技能认证
      </p>

      {/* 分隔线 */}
      <div className="border-t-2 border-dashed border-gray-300 my-4" />

      {/* 证书信息 */}
      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex justify-between">
          <span>考试分数：</span>
          <span className="font-bold">{certificate.score}分</span>
        </div>
        <div className="flex justify-between">
          <span>颁发日期：</span>
          <span>{issuedDate}</span>
        </div>
        <div className="flex justify-between">
          <span>证书编号：</span>
          <span className="font-mono text-xs">{certificate.certificateNumber}</span>
        </div>
      </div>

      {/* 底部装饰 */}
      <div className="mt-6 text-center">
        <div
          className="inline-block px-4 py-1 rounded-full text-xs text-white"
          style={{ backgroundColor: levelInfo.color }}
        >
          官方认证
        </div>
      </div>
    </div>
  )
}

export default CertificateCard
