import React, { useState } from 'react';
import { User } from 'lucide-react';
import Input from '../../general/components/ui/Input';
import Button from '../../general/components/ui/Button';
import Alert from '../../general/components/ui/Alert';
import {useAuth} from '../contexts/AuthContext';

const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'USER' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { register } = useAuth();

  const validateForm = () => {
    const errors = [];

    if (!formData.username.trim()) {
      errors.push('Username is required');
    } else if (formData.username.length < 3) {
      errors.push('Username must be at least 3 characters long');
    } else if (formData.username.length > 50) {
      errors.push('Username must be less than 50 characters');
    }

    if (!formData.password.trim()) {
      errors.push('Password is required');
    } else if (formData.password.length < 6) {
      errors.push('Password must be at least 6 characters long');
    }

    if (!['USER', 'ADMIN'].includes(formData.role)) {
      errors.push('Invalid role selected');
    }

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Client-side validation
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(', '));
      setLoading(false);
      return;
    }

    try {
      const registrationData = {
        username: formData.username.trim(),
        password: formData.password,
        role: formData.role
      };

      await register(registrationData);
      setSuccess('Registration successful! You can now sign in.');
      setFormData({ username: '', password: '', role: 'USER' });
      
      // Auto-switch to login after successful registration
      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value 
    }));
    
    // Clear messages when user starts typing
    if (error) setError('');
    if (success) setSuccess('');
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

      <form onSubmit={handleSubmit} noValidate>
        <Input
          label="Username"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
          autoComplete="username"
          placeholder="Enter your username"
          minLength={3}
          maxLength={50}
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="new-password"
          placeholder="Enter your password"
          minLength={6}
        />
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Role
          </label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          >
            <option value="USER">User</option>
            <option value="ADMIN">Admin</option>
          </select>
        </div>
        <Button 
          type="submit" 
          loading={loading} 
          className="w-full mb-4"
          disabled={!formData.username.trim() || !formData.password.trim()}
        >
          {loading ? 'Creating Account...' : 'Sign Up'}
        </Button>
      </form>

      <p className="text-center text-gray-600">
        Already have an account?{' '}
        <button
          onClick={onSwitchToLogin}
          className="text-blue-600 hover:underline font-medium focus:outline-none focus:underline"
          type="button"
        >
          Sign in
        </button>
      </p>
    </div>
  );
};

export default RegisterForm;