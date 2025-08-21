import { Link } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { 
  Leaf, 
  Store, 
  Cloud, 
  DollarSign, 
  Brain, 
  Shield, 
  Users, 
  TrendingUp 
} from 'lucide-react'

const Home = () => {
  const { isAuthenticated } = useAuth()

  const features = [
    {
      icon: Brain,
      title: 'AI Crop Assistant',
      description: 'Get intelligent recommendations for crop selection and management based on your farm conditions.',
      color: 'text-blue-600'
    },
    {
      icon: Store,
      title: 'Farmer Marketplace',
      description: 'Buy and sell agricultural products directly with other farmers and buyers.',
      color: 'text-green-600'
    },
    {
      icon: Cloud,
      title: 'Weather & Planting Advice',
      description: 'Real-time weather data and optimal planting recommendations for your location.',
      color: 'text-purple-600'
    },
    {
      icon: DollarSign,
      title: 'Microloans',
      description: 'Access to agricultural financing with competitive rates and flexible terms.',
      color: 'text-yellow-600'
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'JWT-based authentication and secure transactions for your peace of mind.',
      color: 'text-red-600'
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with fellow farmers, share knowledge, and grow together.',
      color: 'text-indigo-600'
    }
  ]

  const stats = [
    { label: 'Farmers Served', value: '10,000+', icon: Users },
    { label: 'Products Listed', value: '50,000+', icon: Store },
    { label: 'AI Recommendations', value: '100,000+', icon: Brain },
    { label: 'Loans Disbursed', value: 'Kshs 750M+', icon: DollarSign }
  ]

  return (
    <div className="bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-primary-50 to-secondary-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Revolutionizing
              <span className="text-primary-600 block">Agriculture</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              AgriLink is the smart agriculture marketplace that connects farmers with AI-powered insights, 
              marketplace functionality, and financial services to help you grow smarter.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {!isAuthenticated ? (
                <>
                  <Link to="/register" className="btn-primary text-lg px-8 py-3">
                    Get Started Today
                  </Link>
                  <Link to="/marketplace" className="btn-outline text-lg px-8 py-3">
                    Explore Marketplace
                  </Link>
                </>
              ) : (
                <Link to="/dashboard" className="btn-primary text-lg px-8 py-3">
                  Go to Dashboard
                </Link>
              )}
            </div>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-primary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="flex justify-center mb-4">
                  <stat.icon className="w-8 h-8 text-primary-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              AgriLink provides comprehensive tools and services to modernize your farming operations
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="card hover:shadow-lg transition-shadow duration-300">
                <div className="flex items-center mb-4">
                  <feature.icon className={`w-8 h-8 ${feature.color} mr-3`} />
                  <h3 className="text-xl font-semibold text-gray-900">{feature.title}</h3>
                </div>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Transform Your Farming?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join thousands of farmers who are already using AgriLink to increase their yields and profits.
          </p>
          {!isAuthenticated ? (
            <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
              Start Your Journey
            </Link>
          ) : (
            <Link to="/dashboard" className="bg-white text-primary-600 hover:bg-gray-100 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
              Access Dashboard
            </Link>
          )}
        </div>
      </div>

      {/* How It Works */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              How AgriLink Works
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Simple steps to get started with smart farming
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">1</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Sign Up</h3>
              <p className="text-gray-600">Create your account and complete your farm profile</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">2</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Get Insights</h3>
              <p className="text-gray-600">Receive AI-powered recommendations and weather updates</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-primary-600">3</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Grow & Sell</h3>
              <p className="text-gray-600">Access marketplace and financial services to scale</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home 