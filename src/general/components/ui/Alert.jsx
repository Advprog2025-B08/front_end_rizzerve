import { AlertCircle } from 'lucide-react';

const Alert = ({ children, variant = 'info' }) => {
  const variants = {
    error: 'bg-red-50 text-red-800 border-red-200',
    success: 'bg-green-50 text-green-800 border-green-200',
    info: 'bg-blue-50 text-blue-800 border-blue-200',
  };

  return (
    <div className={`p-4 rounded-lg border ${variants[variant]} mb-4`}>
      <div className="flex items-center">
        <AlertCircle className="w-5 h-5 mr-2" />
        {children}
      </div>
    </div>
  );
};
export default Alert;
