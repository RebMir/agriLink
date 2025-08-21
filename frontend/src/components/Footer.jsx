import { Link } from 'react-router-dom'
import { Leaf, Mail, Phone, MapPin } from 'lucide-react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { name: 'Marketplace', href: '/marketplace' },
      { name: 'AI Assistant', href: '/ai-assistant' },
      { name: 'Weather', href: '/weather' },
      { name: 'Microloans', href: '/microloans' },
    ],
    company: [
      { name: 'About Us', href: '/about-us' },
      { name: 'Contact', href: '/contact' },
      { name: 'Careers', href: '/careers' },
      { name: 'Blog', href: '/blog' },
    ],
    support: [
      { name: 'Help Center', href: '/help' },
      { name: 'Documentation', href: '/docs' },
      { name: 'API Reference', href: '/api' },
      { name: 'Status', href: '/status' },
    ],
    legal: [
      { name: 'Privacy Policy', href: '/privacy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Cookie Policy', href: '/cookies' },
      { name: 'GDPR', href: '/gdpr' },
    ],
  }

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <Leaf className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">AgriLink</span>
            </Link>
            <p className="text-gray-400 mb-6 max-w-md">
              Revolutionizing agriculture through AI-powered insights, marketplace functionality, 
              and financial services to help farmers grow smarter and more profitably.
            </p>
            <div className="flex space-x-4">
              {/* Social Icons */}
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Facebook">
                {/* Facebook SVG */}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="Twitter">
                {/* Twitter SVG */}
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" aria-label="LinkedIn">
                {/* LinkedIn SVG */}
              </a>
            </div>
          </div>

          {/* Footer Links Sections */}
          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h3 className="text-sm font-semibold text-gray-400 tracking-wider uppercase mb-4">
                {section.charAt(0).toUpperCase() + section.slice(1)}
              </h3>
              <ul className="space-y-3">
                {links.map(link => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-gray-300 hover:text-white transition-colors duration-200"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="mt-12 pt-8 border-t border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-3">
            <Mail className="w-5 h-5 text-primary-400" />
            <span className="text-gray-300">support@agrilink.com</span>
          </div>
          <div className="flex items-center space-x-3">
            <Phone className="w-5 h-5 text-primary-400" />
            <span className="text-gray-300">+2547-831-074-20, AGRILINK</span>
          </div>
          <div className="flex items-center space-x-3">
            <MapPin className="w-5 h-5 text-primary-400" />
            <span className="text-gray-300">Nairobi, Kenya</span>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">© {currentYear} AgriLink. All rights reserved.</p>
          <p className="text-gray-400 text-sm mt-2 md:mt-0">Made with ❤️ for the agricultural community</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
