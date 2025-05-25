import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, ShoppingCart, X } from 'lucide-react';
import LoadingSpinner from '../../general/components/ui/Loading';
import Button from '../../general/components/ui/Button';
import Alert from '../../general/components/ui/Alert';
import MenuForm from '../forms/MenuForm';
import MenuRating from '../components/MenuRating';
import AddToCart from '../components/AddToCart';
import { useMenu } from '../contexts/MenuContext';
import { useAuth } from '../../auth/contexts/AuthContext';
import { PesananApi } from '../../manage-pesanan/services/PesananApi';

const MenuDashboard = () => {
  const [menus, setMenus] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cartLoading, setCartLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingMenu, setEditingMenu] = useState(null);
  const [showCart, setShowCart] = useState(false);
  const { menuService } = useMenu();
  const { user } = useAuth();

  const token = localStorage.getItem('authToken');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData?.userId || userData?.id;

  const isAdmin = user?.role === 'ADMIN';

  const loadMenus = async () => {
    try {
      setLoading(true);
      const data = isAdmin 
        ? await menuService.getAllMenus() 
        : await menuService.getActiveMenus();
      setMenus(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadCartItems = async () => {
    if (!token || !userId) return;
    
    try {
      setCartLoading(true);
      const items = await PesananApi.getCartItems(userId, token);
      setCartItems(items || []);
    } catch (err) {
      console.error('Failed to load cart items:', err);
    } finally {
      setCartLoading(false);
    }
  };

  useEffect(() => {
    loadMenus();
    if (token && userId) {
      loadCartItems();
    }
  }, [isAdmin, token, userId]);

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

  const handleCartUpdate = () => {
    loadCartItems();
  };

const handleClearCart = async () => {
    if (!token || !userId) return;
    
    if (window.confirm('Are you sure you want to clear all items from your cart?')) {
      try {
        await PesananApi.clearCart(userId, token);
        setCartItems([]);
        window.location.reload();
      } catch (err) {
        console.error('Failed to clear cart:', err);
        setError('Failed to clear cart');
      }
    }
};

  const cartTotal = cartItems.reduce((total, item) => {
    return total + ((item.menu?.price || 0) * item.quantity);
  }, 0);

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="space-y-6">
      {token && userId && !isAdmin && (
        <div className="bg-white p-4 rounded-lg shadow-lg border-l-4 border-blue-500">
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold flex items-center">
              <ShoppingCart className="w-5 h-5 mr-2" />
              Your Cart ({totalItems} items)
            </h3>
            <div className="flex gap-2">
              <button
                onClick={() => setShowCart(!showCart)}
                className="text-blue-600 hover:text-blue-800 text-sm"
              >
                {showCart ? 'Hide Details' : 'Show Details'}
              </button>
              {cartItems.length > 0 && (
                <button
                  onClick={handleClearCart}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Clear Cart
                </button>
              )}
            </div>
          </div>

          {cartLoading ? (
            <div className="text-center py-4">
              <LoadingSpinner />
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              <ShoppingCart className="w-8 h-8 mx-auto mb-2 text-gray-300" />
              <p>Your cart is empty</p>
              <p className="text-sm">Add some delicious items to get started!</p>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-3">
                <span className="text-lg font-semibold text-green-600">
                  Total: Rp {cartTotal.toLocaleString('id-ID')}
                </span>
              </div>

              {showCart && (
                <div className="space-y-2 border-t pt-3">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center py-2 px-3 bg-gray-50 rounded">
                      <div className="flex-1">
                        <h4 className="font-medium">{item.menu?.name || 'Unknown Item'}</h4>
                        <p className="text-sm text-gray-600">
                          Rp {(item.menu?.price || 0).toLocaleString('id-ID')} × {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="font-semibold">
                          Rp {((item.menu?.price || 0) * item.quantity).toLocaleString('id-ID')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      )}

      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">
          {isAdmin ? 'Menu Management' : 'Menu'}
        </h2>
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
            
            <div className="mb-3">
              <span className="text-xl font-bold text-green-600">
                Rp {(menu.price || 0).toLocaleString('id-ID')}
              </span>
            </div>

            <p className="text-sm text-gray-500 mb-2">URL: {menu.url}</p>
            <p className="text-sm text-gray-500 mb-4">Order: {menu.displayOrder}</p>
            
            <div className="border-t pt-3 mb-4">
              <MenuRating menuId={menu.id} />
            </div>

            {!isAdmin && menu.isActive && (
              <div className="border-t pt-3 mb-3">
                <AddToCart 
                  menuId={menu.id} 
                  price={menu.price || 0}
                  onCartUpdate={handleCartUpdate}
                />
              </div>
            )}
            
            {isAdmin && (
              <span
                className={`inline-block px-2 py-1 rounded text-xs ${
                  menu.isActive
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {menu.isActive ? 'Active' : 'Inactive'}
              </span>
            )}
          </div>
        ))}
      </div>

      {menus.length === 0 && !loading && (
        <div className="text-center py-8 text-gray-500">
          {isAdmin ? 'No menus found.' : 'No active menus available.'}
        </div>
      )}
    </div>
  );
};

export default MenuDashboard;