const API_URL = process.env.BACKEND_API_URL || 'http://localhost:8080/api';

const menuApiRepository = {
    getActiveMenus: async () => {
        const response = await fetch(`${API_URL}/menus`);
        if (!response.ok) {
          throw new Error('Failed to fetch menus');
        }
        return response.json();
      },
      
      getAllMenus: async (token) => {
        const response = await fetch(`${API_URL}/menus/admin`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch all menus');
        }
        return response.json();
      },
      
      getMenuById: async (id, token) => {
        const response = await fetch(`${API_URL}/menus/admin/${id}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to fetch menu');
        }
        return response.json();
      },
      
      createMenu: async (menuData, token) => {
        const response = await fetch(`${API_URL}/menus/admin`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(menuData)
        });
        if (!response.ok) {
          throw new Error('Failed to create menu');
        }
        return response.json();
      },
      
      updateMenu: async (id, menuData, token) => {
        const response = await fetch(`${API_URL}/menus/admin/${id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify(menuData)
        });
        if (!response.ok) {
          throw new Error('Failed to update menu');
        }
        return response.json();
      },
      
      deleteMenu: async (id, token) => {
        const response = await fetch(`${API_URL}/menus/admin/${id}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!response.ok) {
          throw new Error('Failed to delete menu');
        }
        return response.json();
      }
}

export default menuApiRepository;
