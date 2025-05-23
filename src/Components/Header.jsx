import { Layout, LogOut } from 'lucide-react';
import { useApp } from '../Contexts/AppContext';
import Button from './Button';

const Header = () => {
  const { user, logout } = useApp();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Layout className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900">Rizzerve</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <span className="text-gray-700">Welcome, {user?.username}</span>
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              {user?.role}
            </span>
            <Button variant="secondary" onClick={logout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};
export default Header;