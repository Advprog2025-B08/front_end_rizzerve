import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useMemo
} from 'react'

import ApiClient from '../ApiClient'
import AuthService from '../Services/AuthService'
import MenuService from '../Services/MenuService'

const AppContext = createContext()

export function useApp() {
  return useContext(AppContext)
}

export function AppProvider({ children }) {
  const [user,    setUser]    = useState(null)
  const [loading, setLoading] = useState(true)

  const apiClient   = useRef(new ApiClient()).current
  const authService = useRef(new AuthService(apiClient)).current
  const menuService = useRef(new MenuService(apiClient)).current

  useEffect(() => {
    setUser(authService.getCurrentUser())
    setLoading(false)
  }, [authService])

  const login = async creds => {
    await authService.login(creds)
    setUser(authService.getCurrentUser())
  }
  const logout = () => {
    authService.logout()
    setUser(null)
  }

  const value = useMemo(() => ({
    user,
    loading,
    login,
    logout,
    authService,
    menuService,
    isAuthenticated: authService.isAuthenticated(),
    isAdmin:         authService.isAdmin()
  }), [user, loading, authService, menuService])

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  )
}