import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';
import MejaManagement from './components/MejaManagement';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('');
  const [view, setView] = useState('login');

  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUsername = localStorage.getItem('username');
    const storedRole = localStorage.getItem('role');
    
    if (storedToken) {
      setIsLoggedIn(true);
      setToken(storedToken);
      setUsername(storedUsername);
      setRole(storedRole);
      setView('meja');
    }
  }, []);

  const handleLogin = (loginData) => {
    setIsLoggedIn(true);
    setToken(loginData.token);
    setUsername(loginData.username);
    setRole(loginData.role);
    
    localStorage.setItem('token', loginData.token);
    localStorage.setItem('username', loginData.username);
    localStorage.setItem('role', loginData.role);
    
    setView('meja');
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setToken('');
    setUsername('');
    setRole('');
    
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('role');
    
    setView('login');
  };

  const switchView = (newView) => {
    setView(newView);
  };

  return (
    <ErrorBoundary>
      <div className="App">
        <header className="App-header">
          <h1>Rizzerve Restaurant Management</h1>
          {isLoggedIn && (
            <div className="user-info">
              <p>Welcome, {username} ({role})</p>
              <button onClick={handleLogout}>Logout</button>
            </div>
          )}
        </header>
        
        <main>
          {!isLoggedIn ? (
            <div className="auth-container">
              {view === 'login' ? (
                <>
                  <Login onLogin={handleLogin} />
                  <p>
                    Don't have an account?{' '}
                    <button className="link-button" onClick={() => switchView('register')}>
                      Register
                    </button>
                  </p>
                </>
              ) : (
                <>
                  <Register onRegistrationSuccess={() => switchView('login')} />
                  <p>
                    Already have an account?{' '}
                    <button className="link-button" onClick={() => switchView('login')}>
                      Login
                    </button>
                  </p>
                </>
              )}
            </div>
          ) : (
            <MejaManagement token={token} username={username} />
          )}
        </main>
      </div>
    </ErrorBoundary>
  );
}

export default App;