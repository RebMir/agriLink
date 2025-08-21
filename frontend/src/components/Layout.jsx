import { Outlet } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from '../contexts/AuthContext'
import Navbar from './Navbar'
import Footer from './Footer'

const Layout = () => {
  const { loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster position="top-right" />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default Layout 