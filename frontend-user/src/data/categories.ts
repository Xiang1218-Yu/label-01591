import { FunctionCategory } from '../types'

export const categories: FunctionCategory[] = [
  {
    id: 'text',
    name: '文本函数',
    icon: 'Type',
    description: '处理文本字符串，如拼接、截取、转换大小写等',
    color: '#3B82F6',
  },
  {
    id: 'math',
    name: '数学函数',
    icon: 'Calculator',
    description: '进行数学计算，如求和、平均值、最大最小值等',
    color: '#10B981',
  },
  {
    id: 'date',
    name: '日期函数',
    icon: 'Calendar',
    description: '处理日期和时间，如获取年月日、计算日期差等',
    color: '#F59E0B',
  },
  {
    id: 'logic',
    name: '逻辑函数',
    icon: 'GitBranch',
    description: '进行条件判断，如IF、AND、OR等逻辑运算',
    color: '#8B5CF6',
  },
  {
    id: 'lookup',
    name: '查找函数',
    icon: 'Search',
    description: '在数据中查找和引用，如VLOOKUP、INDEX等',
    color: '#EC4899',
  },
]

export const getCategoryById = (id: string): FunctionCategory | undefined => {
  return categories.find(cat => cat.id === id)
}
