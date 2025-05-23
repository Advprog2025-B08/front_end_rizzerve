import React, { useState } from 'react';
import LoadingSpinner from './Components/Loading';
import Header from './Components/Header';
import LoginForm from './Forms/LoginForm';
import RegisterForm from './Forms/RegisterForm';
import MenuDashboard from './Pages/MenuDashboard';
import { useApp } from './Contexts/AppContext';

const App = () => {
  const [showRegister, setShowRegister] = useState(false);
  const { user, loading } = useApp();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        {showRegister ? (
          <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
        ) : (
          <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
        )}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <MenuDashboard />
      </main>
    </div>
  );
};
export default App;