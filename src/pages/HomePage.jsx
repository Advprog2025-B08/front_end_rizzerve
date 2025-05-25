import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../auth/contexts/AuthContext'

export default function HomePage() {
  const { isAuthenticated, user } = useAuth()

  return (
    <div className="text-center">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">
        Welcome to Restaurant Management System
      </h1>
      
      {isAuthenticated ? (
        <div>
          <p className="text-lg text-gray-600 mb-8">
            Hello, {user?.username}! Ready to manage your restaurant?
          </p>
          <Link
            to="/menu"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Manage Menu
          </Link>
        </div>
      ) : (
        <div>
          <p className="text-lg text-gray-600 mb-8">
            Please login to access the management features.
          </p>
          <Link
            to="/login"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  )
}
