function MenuForm({ initialData, onSubmit, onCancel }) {
    const [formData, setFormData] = useState({
      name: initialData?.name || '',
      description: initialData?.description || '',
      url: initialData?.url || '',
      icon: initialData?.icon || '',
      displayOrder: initialData?.displayOrder || 0,
      isActive: initialData?.isActive ?? true
    });
    
    const handleChange = (e) => {
      const { name, value, type, checked } = e.target;
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    };
    
    const handleSubmit = (e) => {
      e.preventDefault();
      onSubmit(formData);
    };
    
    return (
      <div className="bg-white shadow rounded-lg p-6 mb-6">
        <h3 className="text-lg font-medium mb-4">{initialData ? 'Edit Menu' : 'Add New Menu'}</h3>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name *
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                required
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <input
                id="description"
                name="description"
                type="text"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="url">
                URL
              </label>
              <input
                id="url"
                name="url"
                type="text"
                value={formData.url}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="icon">
                Icon
              </label>
              <select
                id="icon"
                name="icon"
                value={formData.icon}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              >
                <option value="">Select an icon</option>
                <option value="home">Home</option>
                <option value="settings">Settings</option>
                <option value="user">User</option>
                <option value="bell">Bell</option>
                <option value="menu">Menu</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="displayOrder">
                Display Order
              </label>
              <input
                id="displayOrder"
                name="displayOrder"
                type="number"
                value={formData.displayOrder}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="isActive"
                name="isActive"
                type="checkbox"
                checked={formData.isActive}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 border-gray-300 rounded"
              />
              <label className="ml-2 block text-gray-700 text-sm font-bold" htmlFor="isActive">
                Active
              </label>
            </div>
          </div>
          
          <div className="mt-6 flex justify-end">
            <button
              type="button"
              onClick={onCancel}
              className="mr-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {initialData ? 'Update' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    );
}
export default MenuForm;