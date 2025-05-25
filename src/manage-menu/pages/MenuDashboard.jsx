import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import LoadingSpinner from '../../general/components/ui/Loading';
import Button from '../../general/components/ui/Button';
import Alert from '../../general/components/ui/Alert';
import MenuForm from '../forms/MenuForm';
import { useMenu } from '../contexts/MenuContext';

const MenuDashboard = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const { menuService, isAdmin } = useMenu();

  const loadMenus = async () => {
    try {
      setLoading(true);
      const data = isAdmin ? await menuService.getAllMenus() : await menuService.getActiveMenus();
      setMenus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
  }, [isAdmin]);

  const handleCreateMenu = async (menuData) => {
    try {
      await menuService.createMenu(menuData);
      setShowForm(false);
      await loadMenus();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUpdateMenu = async (menuData) => {
    try {
      await menuService.updateMenu(editingMenu.id, menuData);
      setEditingMenu(null);
      setShowForm(false);
      await loadMenus();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteMenu = async (id) => {
    if (window.confirm('Are you sure you want to delete this menu?')) {
      try {
        await menuService.deleteMenu(id);
        await loadMenus();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  const handleEdit = (menu) => {
    setEditingMenu(menu);
    setShowForm(true);
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingMenu(null);
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Menu Dashboard</h2>
        {isAdmin && (
          <Button onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Menu
          </Button>
        )}
      </div>

      {error && <Alert variant="error">{error}</Alert>}

      {showForm && (
        <MenuForm
          menu={editingMenu}
          onSubmit={editingMenu ? handleUpdateMenu : handleCreateMenu}
          onCancel={handleCancelForm}
        />
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {menus.map((menu) => (
          <div key={menu.id} className="bg-white p-6 rounded-lg shadow-lg">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-lg font-semibold">{menu.name}</h3>
              {isAdmin && (
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(menu)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteMenu(menu.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
            <p className="text-gray-600 mb-2">{menu.description}</p>
            <p className="text-sm text-gray-500 mb-2">URL: {menu.url}</p>
            <p className="text-sm text-gray-500 mb-2">Order: {menu.displayOrder}</p>
            <span
              className={`inline-block px-2 py-1 rounded text-xs ${
                menu.isActive
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {menu.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        ))}
      </div>

      {menus.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          No menus found.
        </div>
      )}
    </div>
  );
};
export default MenuDashboard;