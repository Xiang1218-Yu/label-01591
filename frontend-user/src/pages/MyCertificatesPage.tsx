import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Award, Download, Eye, Calendar, Hash, ArrowLeft } from 'lucide-react'
import { Certificate } from '../types'

const MyCertificatesPage = () => {
  const navigate = useNavigate()
  const [certificates, setCertificates] = useState<Certificate[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // 从localStorage获取用户所有证书并去重
    const savedCertificates = JSON.parse(localStorage.getItem('certificates') || '[]') as Certificate[]
    
    // 去重处理，根据证书ID或证书编号去重
    const uniqueCertificates = savedCertificates.reduce((acc, current) => {
      const isDuplicate = acc.find(item => 
        item.id === current.id || 
        item.certificateNumber === current.certificateNumber
      )
      if (!isDuplicate) {
        acc.push(current)
      }
      return acc
    }, [] as Certificate[])
    
    // 如果有重复数据，更新localStorage
    if (uniqueCertificates.length !== savedCertificates.length) {
      localStorage.setItem('certificates', JSON.stringify(uniqueCertificates))
    }
    
    setCertificates(uniqueCertificates)
    setLoading(false)
  }, [])

  // 根据分数获取等级颜色
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'A': 'bg-red-100 text-red-700',
      'B': 'bg-orange-100 text-orange-700',
      'C': 'bg-blue-100 text-blue-700',
      'D': 'bg-green-100 text-green-700'
    }
    return colors[level] || 'bg-green-100 text-green-700'
  }

  // 格式化日期
  const formatDate = (date: Date | string) => {
    return new Date(date).toLocaleDateString('zh-CN')
  }

  // 查看证书详情
  const handleViewCertificate = (certificate: Certificate) => {
    // 通过考试ID找到对应的证书页面
    const examResults = JSON.parse(localStorage.getItem('examResults') || '[]')
    const examResult = examResults.find((result: any) => result.id === certificate.id.replace('cert_', 'exam_'))
    if (examResult) {
      navigate(`/certificate/${examResult.id}`)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto py-20 px-4 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">正在加载证书信息...</p>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* 头部 */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-4 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          返回
        </button>
        <div className="flex items-center gap-3 mb-2">
          <Award className="w-8 h-8 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">我的证书</h1>
        </div>
        <p className="text-gray-600">你已获得 {certificates.length} 张证书</p>
      </div>

      {certificates.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Award className="w-10 h-10 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">暂无证书</h3>
          <p className="text-gray-500 mb-6">快去参加考试获得属于你的Excel技能认证证书吧！</p>
          <button
            onClick={() => navigate('/exam')}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            去参加考试
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {certificates.map((certificate) => (
            <div key={certificate.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
              {/* 证书卡片顶部 */}
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold mb-1">{certificate.certificateName}</h3>
                    <p className="text-blue-100 text-sm">{certificate.examName}</p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getLevelColor(certificate.level)}`}>
                    {certificate.level} 级
                  </div>
                </div>
              </div>

              {/* 证书内容 */}
              <div className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <Award className="w-8 h-8 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-gray-500 text-sm">持有人</p>
                    <p className="text-xl font-semibold text-gray-800">{certificate.userName}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Hash className="w-3 h-3" />
                      证书编号
                    </p>
                    <p className="font-mono text-sm font-medium text-gray-800">{certificate.certificateNumber}</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-500 mb-1 flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      发证日期
                    </p>
                    <p className="text-sm font-medium text-gray-800">{formatDate(certificate.issueDate)}</p>
                  </div>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">考试分数</span>
                    <span className="text-2xl font-bold text-blue-600">{certificate.score} 分</span>
                  </div>
                </div>

                {/* 操作按钮 */}
                <div className="flex gap-3">
                  <button
                    onClick={() => handleViewCertificate(certificate)}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    查看
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default MyCertificatesPage
