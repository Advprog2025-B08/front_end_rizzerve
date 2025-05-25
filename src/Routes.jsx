import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MenuDashboard from './manage-menu/pages/MenuDashboard';
import LoginPage from './auth/pages/LoginPage';
import RegisterPage from './auth/pages/RegisterPage';
import MejaManagement from './manage-meja/components/MejaManagement';
import UserTablePanel from './manage-meja/components/UserTablePanel';
import ProtectedRoute from './components/ProtectedRoute';
import RatingPage from './rating/components/RatingPage/RatingPage';
import CheckoutModule from "./checkout/components/CheckoutModule";

// Component to handle the root path redirection
function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

function RoleProtectedRoute({ children, allowedRoles = [] }) {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  try {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const userRole = userData?.role;
    
    if (!userRole) {
      console.warn('User role not found in localStorage');
      return <Navigate to="/dashboard" replace />;
    }
    
    // Fix: Use includes() instead of 'in' operator
    if (allowedRoles.includes(userRole)) {
      return children;
    } else {
      console.warn(`Access denied. User role: ${userRole}, Required roles: ${allowedRoles.join(', ')}`);
      return <Navigate to="/dashboard" replace />;
    }
  } catch (error) {
    console.error('Error parsing userData from localStorage:', error);
    return <Navigate to="/login" replace />;
  }
}

function AdminRoute({ children }) {
  return (
    <RoleProtectedRoute allowedRoles={['ADMIN']}>
      {children}
    </RoleProtectedRoute>
  );
}

function UserRoute({ children }) {
  return (
    <RoleProtectedRoute allowedRoles={['USER']}>
      {children}
    </RoleProtectedRoute>
  );
}

export default function Routes() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Root path - redirect based on auth status */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Protected routes with layout */}
        <Route path="/" element={<Layout />}>
          <Route
            path="dashboard"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="menu"
            element={
              <ProtectedRoute>
                <MenuDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/meja"
            element={
              <AdminRoute>
                <MejaManagement />
              </AdminRoute>
            }
          />
          
          <Route
            path="meja"
            element={
              <UserRoute>
                <UserTablePanel />
              </UserRoute>
            }
          />
          <Route
            path="/ratings"
            element={
              <ProtectedRoute>
                <RatingPage />
              </ProtectedRoute>
            }
          />
            <Route
                path="/checkout"
                element={
                    <ProtectedRoute>
                        <CheckoutModule />
                    </ProtectedRoute>
                }
            />
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
}