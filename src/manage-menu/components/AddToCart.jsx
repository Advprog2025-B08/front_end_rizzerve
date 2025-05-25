import React, { useState, useEffect } from 'react';
import { Plus, Minus, ShoppingCart } from 'lucide-react';
import { PesananApi } from '../../manage-pesanan/services/PesananApi';

export default function AddToCart({ menuId, price, onCartUpdate }) {
  const [quantity, setQuantity] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const token = localStorage.getItem('authToken');
  const userData = JSON.parse(localStorage.getItem('userData') || '{}');
  const userId = userData?.userId || userData?.id;

  useEffect(() => {
    if (!menuId || !userId || !token) return;
    
    const fetchCartItem = async () => {
      try {
        const cartItems = await PesananApi.getCartItems(userId, token);
        const currentItem = cartItems.find(item => item.menuId == menuId);
        setQuantity(currentItem ? currentItem.quantity : 0);
      } catch (error) {
        console.error('Failed to fetch cart items:', error);
      }
    };

    fetchCartItem();
  }, [menuId, userId, token]);

  const handleAddToCart = async () => {
    if (!token || !userId) {
      setError('Please login to add items to cart');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await PesananApi.addItemToCart(userId, menuId, token);
      setQuantity(1);
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
      setError('Failed to add item to cart');
    } finally {
      setLoading(false);
    }
  };

const handleQuantityChange = async (change) => {
    if (!token || !userId) return;

    const newQuantity = quantity + change;
    
    if (newQuantity <= 0) {
      await handleRemove();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await PesananApi.updateCartItem(userId, menuId, change, token);
      setQuantity(newQuantity);
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      console.error('Failed to update cart item:', error);
      setError('Failed to update cart item');
    } finally {
      setLoading(false);
    }
};

  const handleRemove = async () => {
    if (!token || !userId) return;

    setLoading(true);
    setError('');

    try {
      await PesananApi.removeItemFromCart(userId, menuId, token);
      setQuantity(0);
      if (onCartUpdate) onCartUpdate();
    } catch (error) {
      console.error('Failed to remove item from cart:', error);
      setError('Failed to remove item from cart');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-gray-500">Please login to add items to cart</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-2">
        <p className="text-sm text-red-500">{error}</p>
        <button 
          onClick={() => setError('')}
          className="text-xs text-blue-500 hover:underline mt-1"
        >
          Try again
        </button>
      </div>
    );
  }

  if (quantity === 0) {
    return (
      <button
        onClick={handleAddToCart}
        disabled={loading}
        className={`w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <ShoppingCart className="w-4 h-4 mr-2" />
        {loading ? 'Adding...' : 'Add to Cart'}
      </button>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between bg-gray-50 rounded-lg p-2">
        <button
          onClick={() => handleQuantityChange(-1)}
          disabled={loading}
          className={`w-8 h-8 flex items-center justify-center bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Minus className="w-4 h-4" />
        </button>
        
        <div className="text-center">
          <span className="font-semibold text-lg">{quantity}</span>
          <p className="text-xs text-gray-500">
            Total: Rp {(price * quantity).toLocaleString('id-ID')}
          </p>
        </div>
        
        <button
          onClick={() => handleQuantityChange(1)}
          disabled={loading}
          className={`w-8 h-8 flex items-center justify-center bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <button
        onClick={handleRemove}
        disabled={loading}
        className={`w-full px-3 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors ${
          loading ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Remove from Cart
      </button>
    </div>
  );
}