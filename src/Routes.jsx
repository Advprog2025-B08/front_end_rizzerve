import React from 'react';
import { BrowserRouter, Routes as RouterRoutes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './auth/contexts/AuthContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import MenuDashboard from './manage-menu/pages/MenuDashboard';
import LoginPage from './auth/pages/LoginPage';
import RegisterPage from './auth/pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import RatingPage from './rating/components/RatingPage/RatingPage';

// Component to handle the root path redirection
function RootRedirect() {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>; // Or your loading component
  }
  
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

function ProtectedRouteWrapper({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

export default function Routes() {
  return (
    <BrowserRouter>
      <RouterRoutes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Root path - redirect based on auth status */}
        <Route path="/" element={<RootRedirect />} />
        
        {/* Protected routes with layout */}
        <Route path="/" element={<Layout />}>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/menu"
            element={
              <ProtectedRoute>
                <MenuDashboard />
              </ProtectedRoute>
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
        </Route>
      </RouterRoutes>
    </BrowserRouter>
  );
}