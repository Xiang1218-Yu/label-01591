import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import HomePage from './pages/HomePage'
import CategoryPage from './pages/CategoryPage'
import FunctionDetailPage from './pages/FunctionDetailPage'
import PracticePage from './pages/PracticePage'
import FavoritesPage from './pages/FavoritesPage'
import { Toaster } from './components/Toast'

function App() {
  return (
    <>
      <Layout>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/category/:categoryId" element={<CategoryPage />} />
          <Route path="/function/:functionId" element={<FunctionDetailPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </Layout>
      <Toaster />
    </>
  )
}

export default App
