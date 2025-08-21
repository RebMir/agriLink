import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import Layout from './components/Layout'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Marketplace from './pages/Marketplace'
import ProductDetail from './pages/ProductDetail'
import AddProduct from './pages/AddProduct'
import AICropAssistant from './pages/AICropAssistant'
import Microloans from './pages/Microloans'
import Weather from './pages/Weather'
import ProtectedRoute from './components/ProtectedRoute'
import { GoogleOAuthProvider } from '@react-oauth/google'
import AboutUs from './pages/AboutUs'
import Contact from './pages/Contact'
import Careers from './pages/Careers'
import Blog from './pages/Blog'

function App() {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="marketplace" element={<Marketplace />} />
            <Route path="product/:id" element={<ProductDetail />} />
            <Route path="weather" element={<Weather />} />
            <Route path="about-us" element={<AboutUs />} />
            <Route path="contact" element={<Contact />} />
            <Route path="careers" element={<Careers />} />
            <Route path="blog" element={<Blog />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="add-product" element={<AddProduct />} />
              <Route path="ai-assistant" element={<AICropAssistant />} />
              <Route path="microloans" element={<Microloans />} />
            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </GoogleOAuthProvider>
  )
}

export default App 