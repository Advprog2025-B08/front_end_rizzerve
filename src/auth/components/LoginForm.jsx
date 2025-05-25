import React, { useState } from 'react';
import { User } from 'lucide-react';
import Input from '../../general/components/ui/Input';
import Button from '../../general/components/ui/Button';
import Alert from '../../general/components/ui/Alert';
import { useAuth } from '../contexts/AuthContext';

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!formData.password.trim()) {
      setError('Password is required');
      return;
    }

    if (formData.password.length < 3) {
      setError('Password must be at least 3 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login({
        username: formData.username.trim(),
        password: formData.password
      });
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please try again.');
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
    
    if (error) {
      setError('');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-lg shadow-lg">
      <div className="text-center mb-8">
        <User className="w-12 h-12 mx-auto text-blue-600 mb-4" />
        <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
        <p className="text-gray-600 mt-2">Welcome back to Rizzerve</p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

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
        />
        <Input
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          autoComplete="current-password"
          placeholder="Enter your password"
        />
        <Button 
          type="submit" 
          loading={loading} 
          className="w-full mb-4"
          disabled={!formData.username.trim() || !formData.password.trim()}
        >
          {loading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      <p className="text-center text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:underline font-medium focus:outline-none focus:underline"
          type="button"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};

export default LoginForm;