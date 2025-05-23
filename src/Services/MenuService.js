class MenuService {
  constructor(apiClient) {
    this.api = apiClient;
  }

  async getActiveMenus() {
    try {
      return await this.api.getActiveMenus();
    } catch (error) {
      throw new Error('Failed to fetch active menus: ' + error.message);
    }
  }

  async getAllMenus() {
    try {
      return await this.api.getAllMenus();
    } catch (error) {
      throw new Error('Failed to fetch all menus: ' + error.message);
    }
  }

  async getMenuById(id) {
    try {
      return await this.api.getMenuById(id);
    } catch (error) {
      throw new Error('Failed to fetch menu: ' + error.message);
    }
  }

  async createMenu(menuData) {
    try {
      return await this.api.createMenu(menuData);
    } catch (error) {
      throw new Error('Failed to create menu: ' + error.message);
    }
  }

  async updateMenu(id, menuData) {
    try {
      return await this.api.updateMenu(id, menuData);
    } catch (error) {
      throw new Error('Failed to update menu: ' + error.message);
    }
  }

  async deleteMenu(id) {
    try {
      return await this.api.deleteMenu(id);
    } catch (error) {
      throw new Error('Failed to delete menu: ' + error.message);
    }
  }
}
export default MenuService;