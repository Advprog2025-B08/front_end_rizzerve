import React, { useState } from 'react';
import { User } from 'lucide-react';
import Input from '../Components/Input';
import Button from '../Components/Button';
import Alert from '../Components/Alert';
import { useApp } from '../Contexts/AppContext';

const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useApp();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await login(formData);
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
        <h2 className="text-2xl font-bold text-gray-900">Sign In</h2>
        <p className="text-gray-600 mt-2">Welcome back to Rizzerve</p>
      </div>

      {error && <Alert variant="error">{error}</Alert>}

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
        <Button type="submit" loading={loading} className="w-full mb-4">
          Sign In
        </Button>
      </div>

      <p className="text-center text-gray-600">
        Don't have an account?{' '}
        <button
          onClick={onSwitchToRegister}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign up
        </button>
      </p>
    </div>
  );
};
export default LoginForm;