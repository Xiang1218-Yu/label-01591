import { Search, X } from 'lucide-react'
import { useStore } from '../store/useStore'

interface SearchBarProps {
  placeholder?: string
}

export default function SearchBar({ placeholder = '搜索函数...' }: SearchBarProps) {
  const { searchQuery, setSearchQuery } = useStore()

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-3 bg-white border border-border rounded-lg 
                   focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
                   transition-all text-sm text-gray-900 placeholder-gray-400"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X className="w-4 h-4 text-gray-400" />
        </button>
      )}
    </div>
  )
}
