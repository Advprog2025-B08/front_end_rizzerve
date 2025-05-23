import React, { useState } from 'react';
import Input from '../Components/Input';
import Button from '../Components/Button';

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onSubmit(formData);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setFormData({ ...formData, [e.target.name]: value });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-6">{menu ? 'Edit Menu' : 'Add New Menu'}</h3>
      
      <div onSubmit={handleSubmit}>
        <Input
          label="Menu Name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
        <Input
          label="Description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <Input
          label="URL"
          type="text"
          name="url"
          value={formData.url}
          onChange={handleChange}
        />
        <Input
          label="Icon"
          type="text"
          name="icon"
          value={formData.icon}
          onChange={handleChange}
        />
        <Input
          label="Display Order"
          type="number"
          name="displayOrder"
          value={formData.displayOrder}
          onChange={handleChange}
        />
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mr-2"
            />
            Active
          </label>
        </div>
        
        <div className="flex gap-2">
          <Button type="submit" loading={loading}>
            {menu ? 'Update' : 'Create'}
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};
export default MenuForm;