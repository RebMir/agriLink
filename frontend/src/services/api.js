import axios from 'axios'

// Base URL strategy:
// - DEV: always use Vite proxy at '/api' (ignores env to avoid stale ports)
// - PROD/PREVIEW: use VITE_API_BASE_URL (sanitized) or '/api'
let baseURL = '/api'
if (!import.meta.env.DEV) {
  const raw = import.meta.env.VITE_API_BASE_URL
  if (typeof raw === 'string' && raw.trim().length > 0) {
    const cleaned = raw.trim().replace(/%20/g, '').replace(/\/+$/, '')
    baseURL = /\/api$/i.test(cleaned) ? cleaned : `${cleaned}/api`
  }
}

export const api = axios.create({ baseURL, headers: { 'Content-Type': 'application/json' } })

// ✅ Request interceptor → attach token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// ✅ Response interceptor → handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// ---------------- API endpoints ----------------

// 🔑 Auth
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
}

// 🛒 Products
export const productAPI = {
  getProducts: (params) => api.get('/products', { params }),
  getProduct: (id) => api.get(`/products/${id}`),
  createProduct: (productData) => api.post('/products', productData),
  updateProduct: (id, productData) => api.put(`/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/products/${id}`),
  addReview: (id, reviewData) => api.post(`/products/${id}/reviews`, reviewData),
  getMyProducts: () => api.get('/products/seller/me'),
  toggleFavorite: (id) => api.post(`/products/${id}/favorite`),
}

// 🤖 AI
export const aiAPI = {
  getCropRecommendation: (data) => api.post('/ai/crop-recommendation', data),
  getPlantingAdvice: (data) => api.post('/ai/planting-advice', data),
  getPestDiagnosis: (data) => api.post('/ai/pest-diagnosis', data),
}

// 💰 Loans
export const loanAPI = {
  applyForLoan: (loanData) => api.post('/loans/apply', loanData),
  getUserLoans: () => api.get('/loans/user'),
  getLoanDetails: (id) => api.get(`/loans/${id}`),
  updateLoan: (id, loanData) => api.put(`/loans/${id}`, loanData),
  cancelLoan: (id) => api.delete(`/loans/${id}`),
  calculateLoan: (data) => api.post('/loans/calculate', data),
}

// 🌦 Weather
export const weatherAPI = {
  getCurrentWeather: (location) => api.get(`/weather/${location}`),
}
