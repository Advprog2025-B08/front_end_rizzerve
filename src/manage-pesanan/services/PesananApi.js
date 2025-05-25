const API_BASE_URL = 'http://localhost:8080';

export const PesananApi = {
  getOrCreateCart: async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get or create cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Get or create cart error:', error);
      throw error;
    }
  },

  addItemToCart: async (userId, menuId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${userId}/items/${menuId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add item to cart');
      }

      return await response.json();
    } catch (error) {
      console.error('Add item to cart error:', error);
      throw error;
    }
  },

  updateCartItem: async (userId, menuId, quantityChange, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${userId}/items/${menuId}?quantityChange=${quantityChange}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update cart item');
      }

      const data = await response.json();
      return data || null;
    } catch (error) {
      console.error('Update cart item error:', error);
      throw error;
    }
  },

  removeItemFromCart: async (userId, menuId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${userId}/items/${menuId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to remove item from cart');
      }

      return true;
    } catch (error) {
      console.error('Remove item from cart error:', error);
      throw error;
    }
  },

  getCartItems: async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${userId}/items`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to get cart items');
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      console.error('Get cart items error:', error);
      throw error;
    }
  },

  clearCart: async (userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/cart/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Failed to clear cart');
      }

      return true;
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  }
};

export default PesananApi;