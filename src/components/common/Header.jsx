function Header() {
    const { isAuthenticated, isAdmin, user, logout } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    
    return (
      <header className="bg-white shadow">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-800">Rizzerve Menu System</h1>
            </div>
            
            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <>
                  <span className="text-gray-600">Welcome, {user.username}</span>
                  <button 
                    onClick={logout} 
                    className="flex items-center text-gray-600 hover:text-gray-800"
                  >
                    <LogOut size={18} className="mr-1" />
                    Logout
                  </button>
                </>
              ) : (
                <span className="text-gray-600">Please log in</span>
              )}
            </div>
            
            <div className="md:hidden">
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-800"
              >
                {isMobileMenuOpen ? <X size={24} /> : <MenuIcon size={24} />}
              </button>
            </div>
          </div>
          
          {isMobileMenuOpen && (
            <div className="md:hidden py-2 pb-4">
              {isAuthenticated ? (
                <>
                  <div className="px-2 py-2 text-gray-600">Welcome, {user.username}</div>
                  <button 
                    onClick={logout}
                    className="w-full flex items-center px-2 py-2 text-gray-600 hover:bg-gray-100"
                  >
                    <LogOut size={18} className="mr-2" />
                    Logout
                  </button>
                </>
              ) : (
                <div className="px-2 py-2 text-gray-600">Please log in</div>
              )}
            </div>
          )}
        </div>
      </header>
    );
}
export default Header;