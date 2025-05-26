import React, { useState, useEffect } from 'react'
import { Plus, Edit, Trash2, ShoppingCart, Star, Eye, EyeOff, X, Heart, Clock, Award } from 'lucide-react'
import { useAuth } from '../../auth/contexts/AuthContext'
import { useMenu } from '../contexts/MenuContext'
import LoadingSpinner from '../../general/components/ui/Loading'
import Button from '../../general/components/ui/Button'
import Alert from '../../general/components/ui/Alert'
import MenuForm from '../forms/MenuForm'
import MenuRating from '../components/MenuRating'
import AddToCart from '../components/AddToCart'
import { PesananApi } from '../../manage-pesanan/services/PesananApi'

export default function MenuDashboard() {
  const { user } = useAuth()
  const isAdmin = user?.role === 'ADMIN'
  const { menuService } = useMenu()

  const [menus, setMenus] = useState([])
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [cartLoading, setCartLoading] = useState(false)
  const [error, setError] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingMenu, setEditingMenu] = useState(null)
  const [showCart, setShowCart] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('All')

  const token = localStorage.getItem('authToken')
  const userData = JSON.parse(localStorage.getItem('userData') || '{}')
  const userId = userData?.userId || userData?.id

  const loadMenus = async () => {
    setLoading(true)
    try {
      const data = isAdmin
        ? await menuService.getAllMenus()
        : await menuService.getActiveMenus()
      setMenus(data)
      setError('')
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const loadCartItems = async () => {
    if (!token || !userId) return
    
    try {
      setCartLoading(true)
      const items = await PesananApi.getCartItems(userId, token)
      setCartItems(items || [])
    } catch (err) {
      console.error('Failed to load cart items:', err)
    } finally {
      setCartLoading(false)
    }
  }

  useEffect(() => {
    loadMenus()
    if (token && userId) {
      loadCartItems()
    }
  }, [isAdmin, token, userId])

  const handleDeleteMenu = async (id) => {
    if (!window.confirm('Are you sure you want to delete this menu?')) return
    try {
      await menuService.deleteMenu(id)
      await loadMenus()
      setError('')
    } catch (err) {
      setError(err.message)
    }
  }

  const handleCartUpdate = () => {
    loadCartItems()
  }

  const handleClearCart = async () => {
    if (!token || !userId) return
    
    if (window.confirm('Are you sure you want to clear all items from your cart?')) {
      try {
        await PesananApi.clearCart(userId, token)
        setCartItems([])
        setError('')
      } catch (err) {
        console.error('Failed to clear cart:', err)
        setError('Failed to clear cart')
      }
    }
  }

  const cartTotal = cartItems.reduce((total, item) => {
    return total + ((item.menu?.price || 0) * item.quantity)
  }, 0)

  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0)

  // Extract unique categories from menus
  const categories = ['All', ...new Set(menus.map(menu => menu.category).filter(Boolean))]
  const filteredMenus = selectedCategory === 'All' 
    ? menus 
    : menus.filter(menu => menu.category === selectedCategory)

  if (loading) return <LoadingSpinner />

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Cart Section for Non-Admin Users */}
        {token && userId && !isAdmin && (
          <div className="mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center">
                    <ShoppingCart className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">Your Cart</h3>
                    <p className="text-gray-600">{totalItems} items • Rp {cartTotal.toLocaleString('id-ID')}</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowCart(!showCart)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-xl hover:bg-blue-200 transition-colors"
                  >
                    {showCart ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    {showCart ? 'Hide' : 'Show'}
                  </button>
                  {cartItems.length > 0 && (
                    <button
                      onClick={handleClearCart}
                      className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 transition-colors"
                    >
                      <X className="w-4 h-4" />
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {cartLoading ? (
                <LoadingSpinner />
              ) : cartItems.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <ShoppingCart className="w-8 h-8 text-gray-400" />
                  </div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h4>
                  <p className="text-gray-600">Add some delicious items to get started!</p>
                </div>
              ) : (
                <>
                  {showCart && (
                    <div className="space-y-3 border-t border-gray-200 pt-4">
                      {cartItems.map((item) => (
                        <div key={item.id} className="bg-gradient-to-r from-gray-50 to-white rounded-2xl p-4 border border-gray-100">
                          <div className="flex justify-between items-center">
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{item.menu?.name || 'Unknown Item'}</h4>
                              <p className="text-gray-600 text-sm">
                                Rp {(item.menu?.price || 0).toLocaleString('id-ID')} × {item.quantity}
                              </p>
                            </div>
                            <div className="text-right">
                              <span className="text-lg font-bold text-green-600">
                                Rp {((item.menu?.price || 0) * item.quantity).toLocaleString('id-ID')}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {isAdmin ? (
                <>
                  Menu <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Management</span>
                </>
              ) : (
                <>
                  Our <span className="bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">Menu</span>
                </>
              )}
            </h1>
            <p className="text-gray-600 text-lg">
              {isAdmin ? 'Manage your restaurant menu items' : 'Discover our delicious offerings'}
            </p>
          </div>
          
          {isAdmin && !showForm && !editingMenu && (
            <Button onClick={() => setShowForm(true)}>
              <Plus className="w-5 h-5 mr-2" />
              Add New Menu
            </Button>
          )}
        </div>

        {error && <Alert variant="error">{error}</Alert>}

        {/* Category Filter - Only show if there are categories */}
        {categories.length > 1 && (
          <div className="mb-8">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-3 rounded-full font-medium transition-all duration-200 ${
                    selectedCategory === category
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white shadow-lg'
                      : 'bg-white/80 text-gray-700 hover:bg-white border border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Menu Form Modal */}
        {showForm && !editingMenu && (
          <MenuForm
            onSubmit={async (data) => {
              try {
                await menuService.createMenu(data)
                setShowForm(false)
                await loadMenus()
                setError('')
              } catch (err) {
                setError(err.message)
              }
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Menu Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredMenus.map((menu) => (
            <div key={menu.id} className="group">
              {editingMenu?.id === menu.id ? (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50">
                  <MenuForm
                    menu={editingMenu}
                    onSubmit={async (data) => {
                      try {
                        await menuService.updateMenu(menu.id, data)
                        setEditingMenu(null)
                        await loadMenus()
                        setError('')
                      } catch (err) {
                        setError(err.message)
                      }
                    }}
                    onCancel={() => setEditingMenu(null)}
                  />
                </div>
              ) : (
                <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300">
                  {/* Menu Header */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-red-500 rounded-2xl flex items-center justify-center">
                        <Heart className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 break-words">{menu.name}</h3>
                        {menu.category && (
                          <span className="inline-block px-2 py-1 bg-orange-100 text-orange-700 text-xs rounded-full font-medium mt-1">
                            {menu.category}
                          </span>
                        )}
                      </div>
                    </div>
                    
                    {isAdmin && (
                      <div className="flex gap-2 ml-2">
                        <button
                          onClick={() => setEditingMenu(menu)}
                          className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-xl transition-colors"
                          title="Edit menu"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteMenu(menu.id)}
                          className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xl transition-colors"
                          title="Delete menu"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4 leading-relaxed">{menu.description}</p>
                  
                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      Rp {(menu.price || 0).toLocaleString('id-ID')}
                    </div>
                    {menu.cookTime && (
                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <Clock className="w-4 h-4" />
                        {menu.cookTime}
                      </div>
                    )}
                  </div>

                  {/* Rating */}
                  <div className="mb-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-2xl border border-yellow-100">
                    <MenuRating menuId={menu.id} />
                  </div>

                  {/* Add to Cart for Non-Admin */}
                  {!isAdmin && menu.isActive && (
                    <div className="mb-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl border border-green-100">
                      <AddToCart 
                        menuId={menu.id} 
                        price={menu.price || 0}
                        onCartUpdate={handleCartUpdate}
                      />
                    </div>
                  )}
                  
                  {/* Admin Status & Additional Info */}
                  <div className="flex justify-between items-center text-sm text-gray-500 border-t border-gray-100 pt-4">
                    {isAdmin && (
                      <span
                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                          menu.isActive
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {menu.isActive ? '✓ Active' : '✕ Inactive'}
                      </span>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Empty State */}
        {filteredMenus.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No menu items found</h3>
            <p className="text-gray-600">
              {selectedCategory === 'All' 
                ? (isAdmin 
                    ? 'No menu items available. Create your first menu item to get started!' 
                    : 'No menu items available at the moment.'
                  )
                : `No items found in the "${selectedCategory}" category.`
              }
            </p>
            {isAdmin && selectedCategory === 'All' && (
              <Button onClick={() => setShowForm(true)} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Create First Menu
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}