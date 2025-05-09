function UserDashboard() {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    useEffect(() => {
      const fetchMenus = async () => {
        try {
          const data = await apiService.getActiveMenus();
          setMenus(data);
        } catch (error) {
          setError('Failed to fetch menus');
        } finally {
          setLoading(false);
        }
      };
      
      fetchMenus();
    }, []);
    
    if (loading) {
      return <div className="text-center py-8">Loading menus...</div>;
    }
    
    if (error) {
      return (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
          <span className="block sm:inline">{error}</span>
        </div>
      );
    }
    
    return (
      <div>
        <h2 className="text-2xl font-bold mb-6">Available Menus</h2>
        
        {menus.length === 0 ? (
          <p className="text-gray-600">No menus available at the moment.</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-6">
            {menus.map((menu) => (
              <div key={menu.id} className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start mb-4">
                  {menu.icon && (
                    <div className="mr-4 text-gray-500">
                      {/* Render icon based on icon name - assuming basic icons for demo */}
                      {menu.icon === 'home' && <Home size={24} />}
                      {menu.icon === 'settings' && <Settings size={24} />}
                      {menu.icon === 'user' && <User size={24} />}
                      {menu.icon === 'bell' && <Bell size={24} />}
                      {!['home', 'settings', 'user', 'bell'].includes(menu.icon) && <MenuIcon size={24} />}
                    </div>
                  )}
                  <div>
                    <h3 className="text-xl font-semibold">{menu.name}</h3>
                    {menu.description && <p className="text-gray-600 mt-1">{menu.description}</p>}
                  </div>
                </div>
                
                {menu.url && (
                  <a 
                    href={menu.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-500 hover:text-blue-700 font-medium"
                  >
                    Visit
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }