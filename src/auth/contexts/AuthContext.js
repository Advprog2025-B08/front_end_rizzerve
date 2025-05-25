import React, { createContext, useContext, useState, useEffect } from 'react'
import AuthService from '../services/AuthService'

const AuthContext = createContext()

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('authToken')
    const userData = localStorage.getItem('userData')
    if (token && userData) {
      setUser(JSON.parse(userData))
    }
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      const { token, user } = await AuthService.login(credentials)
      localStorage.setItem('authToken', token)
      localStorage.setItem('userData', JSON.stringify(user))
      setUser(user)
      return { success: true }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await AuthService.logout?.()
    } finally {
      localStorage.removeItem('authToken')
      localStorage.removeItem('userData')
      setUser(null)
    }
  }

  const isAuthenticated = !!user

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      logout,
      isAuthenticated,

      getCurrentUser: AuthService.getCurrentUser,
      isAdmin: AuthService.isAdmin,
      getToken: AuthService.getToken
    }}>
      {children}
    </AuthContext.Provider>
  )
}