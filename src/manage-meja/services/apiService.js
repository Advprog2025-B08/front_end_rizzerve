const API_BASE_URL = 'http://localhost:8080'; 

export const apiService = {
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials)
      });
      
      if (!response.ok) {
        throw new Error('Login failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
  
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData)
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Registration failed');
      }
      
      return await response.text();
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  },
  
  getAllMeja: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/meja/user/read`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch tables');
      }
      
      const data = await response.json();
      return data.meja || [];
    } catch (error) {
      console.error('Get meja error:', error);
      throw error;
    }
  },
  
  getMejaById: async (token, mejaId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/meja/user/read/${mejaId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch table details');
      }
      
      const data = await response.json();
      return data.meja;
    } catch (error) {
      console.error('Get meja by id error:', error);
      throw error;
    }
  },
  
  createMeja: async (token, mejaData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/meja/admin/create`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mejaData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create table');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Create meja error:', error);
      throw error;
    }
  },
  
  updateMeja: async (token, mejaId, mejaData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/meja/admin/update/${mejaId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mejaData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update table');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Update meja error:', error);
      throw error;
    }
  },
  
  deleteMeja: async (token, mejaId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/meja/admin/delete/${mejaId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete table');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Delete meja error:', error);
      throw error;
    }
  },
  
  setUserToMeja: async (token, mejaId, username) => {
    try {
      const response = await fetch(`${API_BASE_URL}/meja/user/set/${mejaId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username })
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to assign user to table');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Set user to meja error:', error);
      throw error;
    }
  },
  
  completeOrder: async (token, mejaId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/meja/user/complete_order/${mejaId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to complete order');
      }
      
      return await response.json();
    } catch (error) {
      console.error('Complete order error:', error);
      throw error;
    }
  }
};

export default apiService;