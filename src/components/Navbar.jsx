import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/contexts/AuthContext'
import { LogOut, Menu, Home, Users, ShoppingCart, Star, Settings } from 'lucide-react'

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  if (!isAuthenticated) {
    return null // Don't show navbar for non-authenticated users
  }

  const isAdmin = user?.role === 'ADMIN'
  const isUser = user?.role === 'USER'

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/dashboard" className="text-xl font-bold text-gray-800">
            Restaurant Management
          </Link>
          
          <div className="flex items-center space-x-4">
            {/* Common routes for all authenticated users */}
            <Link 
              to="/dashboard" 
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              <Home className="w-4 h-4 mr-1" />
              Dashboard
            </Link>
            
            <Link 
              to="/menu" 
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              <Menu className="w-4 h-4 mr-1" />
              Menu
            </Link>

            <Link 
              to="/ratings" 
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              <Star className="w-4 h-4 mr-1" />
              Ratings
            </Link>

            <Link 
              to="/checkout" 
              className="text-gray-600 hover:text-gray-800 flex items-center"
            >
              <ShoppingCart className="w-4 h-4 mr-1" />
              Checkout
            </Link>

            {/* Admin-only routes */}
            {isAdmin && (
              <Link 
                to="/admin/meja" 
                className="text-gray-600 hover:text-gray-800 flex items-center"
              >
                <Settings className="w-4 h-4 mr-1" />
                Manage Tables
              </Link>
            )}

            {/* User-only routes */}
            {isUser && (
              <Link 
                to="/meja" 
                className="text-gray-600 hover:text-gray-800 flex items-center"
              >
                <Users className="w-4 h-4 mr-1" />
                My Table
              </Link>
            )}
            
            {/* User info and logout */}
            <div className="flex items-center space-x-2 border-l pl-4">
              <span className="text-gray-600 text-sm">
                Welcome, <span className="font-medium">{user?.username}</span>
              </span>
              <span className={`text-xs px-2 py-1 rounded-full ${
                isAdmin ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {user?.role}
              </span>
              <button
                onClick={handleLogout}
                className="flex items-center text-gray-600 hover:text-gray-800 ml-2"
              >
                <LogOut className="w-4 h-4 mr-1" />
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}