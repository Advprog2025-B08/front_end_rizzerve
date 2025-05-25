import React from 'react'
import { AuthProvider } from './auth/contexts/AuthContext'
import { MenuProvider } from './manage-menu/contexts/MenuContext'
import Routes from './Routes'

export default function App() {
  return (
    <AuthProvider>
      <MenuProvider>
        <Routes/>
      </MenuProvider>
    </AuthProvider>
  )
}