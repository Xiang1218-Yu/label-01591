import { useNavigate } from 'react-router-dom'
import { useRef } from 'react'
import html2canvas from 'html2canvas'
import { Award, FileText, Download, Printer, Calendar, User, Medal } from 'lucide-react'
import { useStore } from '../store/useStore'

const CertificatePage = () => {
  const navigate = useNavigate()
  const certificates = useStore((state) => state.certificates)

  const formatDate = (date: Date) => {
    const d = new Date(date)
    return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
  }

  const getLevelColor = (level: string) => {
    switch (level) {
      case '高级':
        return 'text-red-600 bg-red-100'
      case '中级':
        return 'text-orange-600 bg-orange-100'
      case '初级':
        return 'text-green-600 bg-green-100'
      default:
        return 'text-gray-600 bg-gray-100'
    }
  }

  const handlePrint = () => {
    window.print()
  }

  const certificateRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})

  const handleSave = async (certificateId: string) => {
    const element = certificateRefs.current[certificateId]
    if (!element) return

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      })

      const link = document.createElement('a')
      link.download = `证书_${certificateId}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    } catch (error) {
      console.error('保存证书失败:', error)
      alert('保存失败，请重试')
    }
  }

  if (certificates.length === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Award className="w-12 h-12 text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">暂无证书</h1>
          <p className="text-gray-600 mb-8">
            您还没有获得任何证书，参加Excel函数技能考试并通过即可获得证书。
          </p>
          <button
            onClick={() => navigate('/exam')}
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
          >
            前往考试
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">我的证书</h1>
        <p className="text-gray-600">您已获得 {certificates.length} 个证书</p>
      </div>

      <div className="space-y-6">
        {certificates.slice().reverse().map((certificate) => (
          <div key={certificate.id} className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div
              ref={(el) => {
                certificateRefs.current[certificate.id] = el
              }}
              className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-orange-500 p-1"
            >
              <div className="bg-white p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center">
                      <Medal className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-800">Excel函数技能认证</h2>
                      <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${getLevelColor(certificate.level)}`}>
                        {certificate.level}证书
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">证书编号</p>
                    <p className="font-mono font-semibold text-gray-700">{certificate.certificateNumber}</p>
                  </div>
                </div>

                <div className="border-t-2 border-b-2 border-dashed border-yellow-200 py-8 my-6">
                  <div className="text-center">
                    <p className="text-gray-500 mb-2">兹证明</p>
                    <div className="flex items-center justify-center gap-2 mb-4">
                      <User className="w-6 h-6 text-gray-400" />
                      <span className="text-3xl font-bold text-gray-800">{certificate.userName}</span>
                    </div>
                    <p className="text-gray-600 mb-4">
                      已完成Excel函数技能认证考试，成绩达到
                      <span className="text-primary font-bold text-xl mx-1">{certificate.score}</span>
                      分，特发此证。
                    </p>
                    <div className="flex items-center justify-center gap-2 text-gray-500">
                      <Calendar className="w-4 h-4" />
                      <span>发证日期：{formatDate(certificate.issueDate)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between items-end">
                  <div className="flex items-center gap-2 text-gray-500">
                    <FileText className="w-5 h-5" />
                    <span className="text-sm">Excel函数学习助手</span>
                  </div>
                  <div className="text-right">
                    <div className="w-24 h-24 border-4 border-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
                      <span className="text-yellow-600 font-bold text-sm text-center">
                        认证<br/>专用章
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 px-8 py-4 flex justify-end gap-4">
              <button
                onClick={() => handleSave(certificate.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                <Download className="w-4 h-4" />
                保存
              </button>
              <button
                onClick={handlePrint}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                <Printer className="w-4 h-4" />
                打印
              </button>
            </div>
          </div>
        ))}
      </div>

      {certificates.length > 0 && (
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/exam')}
            className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors inline-flex items-center gap-2"
          >
            <Award className="w-5 h-5" />
            再次参加考试
          </button>
        </div>
      )}
    </div>
  )
}

export default CertificatePage
