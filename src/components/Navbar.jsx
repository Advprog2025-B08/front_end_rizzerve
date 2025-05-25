import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/contexts/AuthContext'
import { LogOut, Menu } from 'lucide-react'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="text-xl font-bold text-gray-800">
            Restaurant Management
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-gray-800">
              Home
            </Link>
            <Link to="/menu" className="text-gray-600 hover:text-gray-800 flex items-center">
              <Menu className="w-4 h-4 mr-1" />
              Menu
            </Link>
            
            {user && (
              <div className="flex items-center space-x-2">
                <span className="text-gray-600">Welcome, {user.username}</span>
                <button
                  onClick={handleLogout}
                  className="flex items-center text-gray-600 hover:text-gray-800"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
