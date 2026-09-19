import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import MainLayout from './layouts/MainLayout'
import HomePage from './pages/HomePage'
import BlogPage from './pages/BlogPage'
import BlogPostPage from './pages/BlogPostPage'
import AdminPage from './pages/AdminPage'
import NotFoundPage from './pages/NotFoundPage'
import { ADMIN_SECRET_ROUTE } from './data/portfolioData'

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#0d1424',
            color: '#e2e8f0',
            border: '1px solid rgba(99, 102, 241, 0.3)',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#0d1424' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#0d1424' },
          },
        }}
      />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<HomePage />} />
          <Route path="blog" element={<BlogPage />} />
          <Route path="blog/:slug" element={<BlogPostPage />} />
        </Route>

        {/* Hidden Admin Route — not linked anywhere public */}
        <Route path={ADMIN_SECRET_ROUTE} element={<AdminPage />} />
        <Route path={`${ADMIN_SECRET_ROUTE}/*`} element={<AdminPage />} />

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
