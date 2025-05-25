// src/components/common/Alerts.jsx
import React from 'react';
import { AlertCircle, Check } from 'lucide-react';

export const ErrorAlert = ({ message, onClose }) => (
    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4 flex items-center">
        <AlertCircle className="w-5 h-5 text-red-500 mr-3" />
        <span className="text-red-800 flex-1">{message}</span>
        {onClose && (
            <button onClick={onClose} className="text-red-500 hover:text-red-700">
                <span className="sr-only">Close</span>×
            </button>
        )}
    </div>
);

export const SuccessAlert = ({ message, onClose }) => (
    <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4 flex items-center">
        <Check className="w-5 h-5 text-green-500 mr-3" />
        <span className="text-green-800 flex-1">{message}</span>
        {onClose && (
            <button onClick={onClose} className="text-green-500 hover:text-green-700">
                <span className="sr-only">Close</span>×
            </button>
        )}
    </div>
);

export const LoadingSpinner = () => (
    <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
);