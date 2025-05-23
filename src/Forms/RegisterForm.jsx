import React, { useState } from 'react';
import { User } from 'lucide-react';
import Input from '../Components/Input';
import Button from '../Components/Button';
import Alert from '../Components/Alert';
import { useApp } from '../Contexts/AppContext';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { authService } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await authService.register(formData);
      setSuccess('Registration successful! You can now sign in.');
      setFormData({ username: '', password: '', role: 'USER' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <User className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Sign Up</h2>
        <p className="text-gray-600 mt-2">Create your Rizzerve account</p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <div onSubmit={handleSubmit}>
        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <Button type="submit" loading={loading} className="w-full mb-4">
          Sign Up
        </Button>
      </div>

      <p className="text-center text-gray-600">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};
export default RegisterForm;