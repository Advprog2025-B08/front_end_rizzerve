import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const { getCurrentUser } = useAuth();
  
  // Check if user is already authenticated
  const currentUser = getCurrentUser();
  if (currentUser) {
    return <Navigate to="/" replace />;
  }

  const switchToRegister = () => {
    setIsLoginMode(false);
  };

  const switchToLogin = () => {
    setIsLoginMode(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {isLoginMode ? (
          <LoginForm onSwitchToRegister={switchToRegister} />
        ) : (
          <RegisterForm onSwitchToLogin={switchToLogin} />
        )}
      </div>
    </div>
  );
};

export default LoginPage;