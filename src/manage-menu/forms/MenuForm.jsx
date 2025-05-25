import React, { useState } from 'react';
import Input from '../../general/components/ui/Input';
import Button from '../../general/components/ui/Button';
import Alert from '../../general/components/ui/Alert';

const MenuForm = ({ menu, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState({
    name: menu?.name || '',
    description: menu?.description || '',
    url: menu?.url || '',
    icon: menu?.icon || '',
    displayOrder: menu?.displayOrder || 0,
    isActive: menu?.isActive !== undefined ? menu.isActive : true,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const validateForm = () => {
    const errors = [];

    if (!formData.name.trim()) {
      errors.push('Menu name is required');
    } else if (formData.name.length > 100) {
      errors.push('Menu name must be less than 100 characters');
    }

    if (formData.description && formData.description.length > 500) {
      errors.push('Description must be less than 500 characters');
    }

    if (formData.url && formData.url.trim()) {
      try {
        new URL(formData.url);
      } catch {
        // If not a valid URL, check if it's a relative path
        if (!formData.url.startsWith('/') && !formData.url.startsWith('./') && !formData.url.startsWith('../')) {
          errors.push('Invalid URL format');
        }
      }
    }

    if (isNaN(parseInt(formData.displayOrder)) || parseInt(formData.displayOrder) < 0) {
      errors.push('Display order must be a non-negative number');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      return;
    }

    setLoading(true);

    try {
      const processedData = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        url: formData.url.trim(),
        icon: formData.icon.trim(),
        displayOrder: parseInt(formData.displayOrder) || 0,
        isActive: Boolean(formData.isActive)
      };

      await onSubmit(processedData);
    } catch (err) {
      console.error('Form submission error:', err);
      setError(err.message || 'Failed to save menu. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({ 
      ...prev, 
      [name]: newValue 
    }));
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-6">
        {menu ? 'Edit Menu' : 'Add New Menu'}
      </h3>
      
      {error && <Alert variant="error">{error}</Alert>}
      
      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Menu Name *"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="Enter menu name"
          maxLength={100}
        />
        
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="3"
            placeholder="Enter menu description"
            maxLength={500}
          />
          <div className="text-xs text-gray-500 mt-1">
            {formData.description.length}/500 characters
          </div>
        </div>

        <Input
          label="URL"
          type="text"
          name="url"
          value={formData.url}
          onChange={handleChange}
          placeholder="e.g., /dashboard or https://example.com"
        />
        
        <Input
          label="Icon"
          type="text"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
          placeholder="Icon name or class"
        />
        
        <Input
          label="Display Order"
          type="number"
          name="displayOrder"
          value={formData.displayOrder}
          onChange={handleChange}
          min="0"
          step="1"
        />
        
        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">
              Active
            </span>
          </label>
        </div>
        
        <div className="flex gap-2">
          <Button 
            type="submit" 
            loading={loading}
            disabled={!formData.name.trim()}
          >
            {loading ? 'Saving...' : (menu ? 'Update' : 'Create')}
          </Button>
          <Button 
            type="button" 
            variant="secondary" 
            onClick={onCancel}
            disabled={loading}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
};

export default MenuForm;