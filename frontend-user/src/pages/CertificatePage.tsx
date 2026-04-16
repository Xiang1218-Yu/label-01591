import { useEffect, useState, useRef } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Award, Download, ArrowLeft, Calendar, Hash, User, CheckCircle } from 'lucide-react'
import html2canvas from 'html2canvas'
import { Certificate, ExamResult } from '../types'

const CertificatePage = () => {
  const { examId } = useParams<{ examId: string }>()
  const navigate = useNavigate()
  const certificateRef = useRef<HTMLDivElement>(null)
  
  const [certificate, setCertificate] = useState<Certificate | null>(null)
  const [examResult, setExamResult] = useState<ExamResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)

  // 生成随机证书编号
  const generateCertificateNumber = () => {
    const prefix = 'EXCEL-'
    const year = new Date().getFullYear()
    const random = Math.floor(Math.random() * 1000000).toString().padStart(6, '0')
    return `${prefix}${year}-${random}`
  }

  // 根据分数获取等级
  const getLevelByScore = (score: number, total: number): 'A' | 'B' | 'C' | 'D' => {
    const percentage = (score / total) * 100
    if (percentage >= 90) return 'A'
    if (percentage >= 80) return 'B'
    if (percentage >= 70) return 'C'
    return 'D'
  }

  // 获取等级描述
  const getLevelDescription = (level: string) => {
    const descriptions: Record<string, string> = {
      'A': '优秀',
      'B': '良好',
      'C': '中等',
      'D': '合格'
    }
    return descriptions[level] || '合格'
  }

  // 获取等级颜色
  const getLevelColor = (level: string) => {
    const colors: Record<string, string> = {
      'A': 'text-red-600',
      'B': 'text-orange-600',
      'C': 'text-blue-600',
      'D': 'text-green-600'
    }
    return colors[level] || 'text-green-600'
  }

  useEffect(() => {
    if (!examId) {
      navigate('/exam')
      return
    }

    // 从localStorage获取考试结果
    const existingResults = JSON.parse(localStorage.getItem('examResults') || '[]') as ExamResult[]
    const result = existingResults.find(r => r.id === examId)

    if (!result || !result.passed) {
      navigate('/exam')
      return
    }

    setExamResult(result)

    // 生成证书信息
    const cert: Certificate = {
      id: `cert_${Date.now()}_${Math.random().toString(36).substring(2, 10)}`, // 确保ID唯一
      userId: 'user_001', // 这里可以替换为实际用户ID
      userName: '用户', // 这里可以替换为实际用户名
      certificateName: 'Excel函数技能认证证书',
      examName: result.examName,
      score: result.userScore,
      issueDate: result.endTime,
      certificateNumber: generateCertificateNumber(),
      level: getLevelByScore(result.userScore, result.totalScore)
    }

    setCertificate(cert)

    // 保存证书到localStorage，避免重复添加
    const existingCertificates = JSON.parse(localStorage.getItem('certificates') || '[]') as Certificate[]
    // 检查是否已经存在该考试对应的证书，避免重复
    const isCertificateExists = existingCertificates.some(c => 
      c.certificateNumber === cert.certificateNumber || 
      c.id.includes(result.id)
    )
    
    if (!isCertificateExists) {
      localStorage.setItem('certificates', JSON.stringify([...existingCertificates, cert]))
    }

    setLoading(false)
  }, [examId, navigate])

  // 下载证书为PNG图片
  const handleDownloadCertificate = async () => {
    if (!certificateRef.current || !certificate) return

    try {
      setDownloading(true)
      
      // 生成证书图片
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2, // 高清导出
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      })

      // 创建下载链接
      const link = document.createElement('a')
      link.download = `Excel函数技能证书_${certificate.certificateNumber}.png`
      link.href = canvas.toDataURL('image/png', 1.0)
      link.click()
      
    } catch (error) {
      console.error('证书下载失败:', error)
      alert('证书下载失败，请稍后重试或使用截图功能保存')
    } finally {
      setDownloading(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <div className="animate-spin w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-gray-600">正在加载证书信息...</p>
      </div>
    )
  }

  if (!certificate || !examResult) {
    return (
      <div className="max-w-4xl mx-auto py-20 px-4 text-center">
        <p className="text-red-500 mb-4">证书不存在或你未通过该考试</p>
        <button
          onClick={() => navigate('/exam')}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          返回考试页面
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* 返回按钮 */}
      <button
        onClick={() => navigate('/exam')}
        className="flex items-center gap-2 text-gray-600 hover:text-blue-600 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        返回考试页面
      </button>

      {/* 证书卡片 */}
      <div ref={certificateRef} className="bg-white rounded-xl shadow-xl overflow-hidden border-4 border-blue-500 relative">
        {/* 装饰边框 */}
        <div className="absolute inset-0 border-8 border-dashed border-blue-200 m-4 pointer-events-none rounded-lg"></div>

        {/* 证书内容 */}
        <div className="p-12 relative">
          {/* 顶部 */}
          <div className="text-center mb-10">
            <div className="flex justify-center mb-4">
              <div className="bg-blue-100 p-4 rounded-full">
                <Award className="w-16 h-16 text-blue-600" />
              </div>
            </div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">{certificate.certificateName}</h1>
            <p className="text-gray-500 text-lg">技能认证官方证书</p>
          </div>

          {/* 证书主体 */}
          <div className="mb-10">
            <p className="text-xl text-gray-700 mb-8 text-center">
              兹授予 <span className="font-bold text-blue-600 text-2xl">{certificate.userName}</span>
            </p>

            <div className="bg-gray-50 rounded-lg p-8 mb-8 border border-gray-200">
              <p className="text-center text-gray-700 text-lg mb-6">
                在 <span className="font-semibold">{certificate.examName}</span> 考试中表现出色，成绩合格，特发此证。
              </p>

              <div className="grid grid-cols-2 gap-8 mb-6">
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">考试分数</p>
                  <p className="text-3xl font-bold text-blue-600">
                    {certificate.score} <span className="text-lg text-gray-400">/ {examResult.totalScore}</span>
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-sm text-gray-500 mb-1">成绩等级</p>
                  <p className={`text-3xl font-bold ${getLevelColor(certificate.level)}`}>
                    {certificate.level} <span className="text-lg text-gray-400">({getLevelDescription(certificate.level)})</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <Calendar className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">发证日期</p>
                    <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString('zh-CN')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                  <Hash className="w-5 h-5 text-blue-500 flex-shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">证书编号</p>
                    <p className="font-medium font-mono">{certificate.certificateNumber}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* 技能说明 */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                已掌握技能
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {['SUM、COUNT、AVERAGE等基础函数', 'VLOOKUP、INDEX、MATCH等查找函数', 'IF、COUNTIF、SUMIF等条件函数', '数据处理与分析能力', '公式编写与调试能力'].map((skill, index) => (
                  <div key={index} className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{skill}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* 底部说明 */}
            <div className="text-center text-sm text-gray-500">
              <p>本证书证明持证人具备Excel函数应用的专业能力，可作为相关技能水平的有效证明。</p>
              <p className="mt-2">官网可查 · 终身有效</p>
            </div>
          </div>

          {/* 底部签章 */}
          <div className="flex justify-between items-end">
            <div>
              <p className="text-gray-500 text-sm mb-1">发证机构</p>
              <div className="h-16 w-32 bg-blue-100 rounded flex items-center justify-center text-blue-800 font-bold">
                Excel技能认证中心
              </div>
            </div>
            <div className="text-right">
              <p className="text-gray-500 text-sm mb-1">签章日期</p>
              <p className="font-medium">{new Date(certificate.issueDate).toLocaleDateString('zh-CN')}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 操作按钮 */}
      <div className="flex justify-center gap-4 mt-8">
        <button
          onClick={handleDownloadCertificate}
          disabled={downloading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {downloading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              下载中...
            </>
          ) : (
            <>
              <Download className="w-5 h-5" />
              下载证书
            </>
          )}
        </button>
        <button
          onClick={() => navigate('/my-certificates')}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          我的证书
        </button>
        <button
          onClick={() => navigate('/exam')}
          className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          再考一次
        </button>
      </div>
    </div>
  )
}

export default CertificatePage
