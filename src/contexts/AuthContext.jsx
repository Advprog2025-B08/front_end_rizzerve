const AuthContext = React.createContext(null);

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);
  
  const login = async (username, password) => {
    try {
      const userData = await apiService.login(username, password);
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      return userData;
    } catch (error) {
      throw error;
    }
  };
  
  const register = async (username, password, role) => {
    try {
      await apiService.register(username, password, role);
      // After registration, log in the user
      return login(username, password);
    } catch (error) {
      throw error;
    }
  };
  
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };
  
  const value = {
    user,
    login,
    register,
    logout,
    isAdmin: user?.role === 'ADMIN',
    isAuthenticated: !!user,
    token: user?.token
  };
  
  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }
  
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

function useAuth() {
    const context = React.useContext(AuthContext);
    if (!context) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}