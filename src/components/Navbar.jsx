import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../auth/contexts/AuthContext'
import { 
  LogOut, 
  Menu as MenuIcon, 
  Home, 
  Users, 
  ShoppingCart, 
  Settings, 
  ChefHat,
  X,
  User
} from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!isAuthenticated) {
    return null // Don't show navbar for non-authenticated users
  }

  const isAdmin = user?.role === 'ADMIN'
  const isUser = user?.role === 'USER'

  const isActiveLink = (path) => location.pathname === path

  const navigationItems = [
    { 
      to: '/dashboard', 
      icon: Home, 
      label: 'Dashboard', 
      show: true 
    },
    { 
      to: '/menu', 
      icon: ChefHat, 
      label: 'Menu', 
      show: true 
    },
    { 
      to: '/checkout', 
      icon: ShoppingCart, 
      label: 'Checkout', 
      show: true 
    },
    { 
      to: '/admin/meja', 
      icon: Settings, 
      label: 'Manage Tables', 
      show: isAdmin 
    },
    { 
      to: '/meja', 
      icon: Users, 
      label: 'My Table', 
      show: isUser 
    }
  ]

  const NavLink = ({ to, icon: Icon, label, mobile = false }) => (
    <Link
      to={to}
      className={`
        flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
        ${isActiveLink(to) 
          ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg' 
          : 'text-gray-600 hover:text-orange-600 hover:bg-orange-50'
        }
        ${mobile ? 'w-full justify-start' : ''}
      `}
      onClick={() => mobile && setIsMobileMenuOpen(false)}
    >
      <Icon className="w-4 h-4" />
      <span>{label}</span>
    </Link>
  )

  return (
    <>
      <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link 
              to="/dashboard" 
              className="flex items-center space-x-2 text-xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent hover:from-orange-700 hover:to-red-700 transition-all duration-200"
            >
              <ChefHat className="w-6 h-6 text-orange-600" />
              <span>RIZZERVE</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-1">
              {navigationItems.map((item) => 
                item.show && (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    icon={item.icon}
                    label={item.label}
                  />
                )
              )}
            </div>

            {/* User Profile & Actions */}
            <div className="flex items-center space-x-4">
              {/* User Info - Hidden on small screens */}
              <div className="hidden lg:flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-full">
                <div className="flex items-center justify-center w-8 h-8 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                  <User className="w-4 h-4 text-white" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-800">
                    {user?.username}
                  </span>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    isAdmin 
                      ? 'bg-red-100 text-red-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {user?.role}
                  </span>
                </div>
              </div>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200 font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded-lg transition-all duration-200"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="fixed top-16 left-0 right-0 bg-white shadow-xl border-t border-gray-100 p-4 space-y-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Mobile User Info */}
            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-xl mb-4">
              <div className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-orange-500 to-red-500 rounded-full">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="flex flex-col">
                <span className="font-medium text-gray-800">
                  {user?.username}
                </span>
                <span className={`text-xs px-2 py-1 rounded-full font-medium w-fit ${
                  isAdmin 
                    ? 'bg-red-100 text-red-700' 
                    : 'bg-blue-100 text-blue-700'
                }`}>
                  {user?.role}
                </span>
              </div>
            </div>

            {/* Mobile Navigation Links */}
            {navigationItems.map((item) => 
              item.show && (
                <NavLink
                  key={item.to}
                  to={item.to}
                  icon={item.icon}
                  label={item.label}
                  mobile={true}
                />
              )
            )}
          </div>
        </div>
      )}
    </>
  )
}