function AdminDashboard() {
    const { token } = useAuth();
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editMenu, setEditMenu] = useState(null);
    
    const fetchMenus = async () => {
      setLoading(true);
      try {
        const data = await apiService.getAllMenus(token);
        setMenus(data);
      } catch (error) {
        setError('Failed to fetch menus');
      } finally {
        setLoading(false);
      }
    };
    
    useEffect(() => {
      fetchMenus();
    }, [token]);
    
    const handleDelete = async (id) => {
      if (window.confirm('Are you sure you want to delete this menu?')) {
        try {
          await apiService.deleteMenu(id, token);
          setMenus(menus.filter(menu => menu.id !== id));
        } catch (error) {
          setError('Failed to delete menu');
        }
      }
    };
    
    const handleEdit = (menu) => {
      setEditMenu(menu);
      setIsFormOpen(true);
    };
    
    const handleFormClose = () => {
      setIsFormOpen(false);
      setEditMenu(null);
    };
    
    const handleFormSubmit = async (menuData) => {
      try {
        if (editMenu) {
          const updatedMenu = await apiService.updateMenu(editMenu.id, menuData, token);
          setMenus(menus.map(menu => menu.id === editMenu.id ? updatedMenu : menu));
        } else {
          const newMenu = await apiService.createMenu(menuData, token);
          setMenus([...menus, newMenu]);
        }
        handleFormClose();
      } catch (error) {
        setError(`Failed to ${editMenu ? 'update' : 'create'} menu`);
      }
    };
    
    if (loading) {
      return <div className="text-center py-8">Loading menus...</div>;
    }
    
    return (
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Menu Management</h2>
          <button
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded inline-flex items-center"
          >
            <Plus size={18} className="mr-1" />
            Add Menu
          </button>
        </div>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4" role="alert">
            <span className="block sm:inline">{error}</span>
          </div>
        )}
        
        {isFormOpen && (
          <MenuForm 
            initialData={editMenu}
            onSubmit={handleFormSubmit}
            onCancel={handleFormClose}
          />
        )}
        
        {menus.length === 0 ? (
          <p className="text-gray-600">No menus available. Add one to get started.</p>
        ) : (
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">URL</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Display Order</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {menus.map((menu) => (
                  <tr key={menu.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {menu.icon && (
                          <div className="flex-shrink-0 mr-3 text-gray-500">
                            {menu.icon === 'home' && <Home size={20} />}
                            {menu.icon === 'settings' && <Settings size={20} />}
                            {menu.icon === 'user' && <User size={20} />}
                            {menu.icon === 'bell' && <Bell size={20} />}
                            {!['home', 'settings', 'user', 'bell'].includes(menu.icon) && <MenuIcon size={20} />}
                          </div>
                        )}
                        <div className="text-sm font-medium text-gray-900">{menu.name}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{menu.description || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{menu.url || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{menu.displayOrder || '-'}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        menu.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {menu.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(menu)}
                        className="text-blue-600 hover:text-blue-900 mr-3"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete(menu.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        <Trash size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    );
}
export default AdminDashboard;
  