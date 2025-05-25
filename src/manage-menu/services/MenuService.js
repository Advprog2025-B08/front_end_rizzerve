class MenuService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  async getActiveMenus() {
    try {
      const menus = await this.api.getActiveMenus();
      return Array.isArray(menus) ? menus : [];
    } catch (error) {
      console.error('Error fetching active menus:', error);
      throw error;
    }
  }

  async getAllMenus() {
    try {
      const menus = await this.api.getAllMenus();
      return Array.isArray(menus) ? menus : [];
    } catch (error) {
      console.error('Error fetching all menus:', error);
      throw error;
    }
  }

  async getMenuById(id) {
    try {
      if (!id) {
        throw new Error('Menu ID is required');
      }
      
      const menu = await this.api.getMenuById(id);
      return menu;
    } catch (error) {
      console.error(`Error fetching menu ${id}:`, error);
      throw error;
    }
  }

  async createMenu(menuData) {
    try {
      if (!menuData || !menuData.name) {
        throw new Error('Menu name is required');
      }

      const processedData = {
        ...menuData,
        displayOrder: parseInt(menuData.displayOrder) || 0,
        isActive: Boolean(menuData.isActive)
      };

      const createdMenu = await this.api.createMenu(processedData);
      return createdMenu;
    } catch (error) {
      console.error('Error creating menu:', error);
      throw error;
    }
  }

  async updateMenu(id, menuData) {
    try {
      if (!id) {
        throw new Error('Menu ID is required');
      }

      if (!menuData || !menuData.name) {
        throw new Error('Menu name is required');
      }

      const processedData = {
        ...menuData,
        displayOrder: parseInt(menuData.displayOrder) || 0,
        isActive: Boolean(menuData.isActive)
      };

      const updatedMenu = await this.api.updateMenu(id, processedData);
      return updatedMenu;
    } catch (error) {
      console.error(`Error updating menu ${id}:`, error);
      throw error;
    }
  }

  async deleteMenu(id) {
    try {
      if (!id) {
        throw new Error('Menu ID is required');
      }

      const result = await this.api.deleteMenu(id);
      return result;
    } catch (error) {
      console.error(`Error deleting menu ${id}:`, error);
      throw error;
    }
  }

  // Utility methods
  validateMenuData(menuData) {
    const errors = [];

    if (!menuData.name || menuData.name.trim().length === 0) {
      errors.push('Menu name is required');
    }

    if (menuData.name && menuData.name.length > 100) {
      errors.push('Menu name must be less than 100 characters');
    }

    if (menuData.url && !this.isValidUrl(menuData.url)) {
      errors.push('Invalid URL format');
    }

    if (menuData.displayOrder && isNaN(parseInt(menuData.displayOrder))) {
      errors.push('Display order must be a number');
    }

    return errors;
  }

  isValidUrl(string) {
    try {
      new URL(string);
      return true;
    } catch (_) {
      // Check if it's a relative URL
      return string.startsWith('/') || string.startsWith('./') || string.startsWith('../');
    }
  }
}

export default MenuService;