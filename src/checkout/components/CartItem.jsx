// src/components/checkout/CartItem.jsx
import React from 'react';
import { Plus, Minus } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const CartItem = ({ item, onUpdateQuantity, disabled = false }) => {
    const handleIncrement = () => {
        onUpdateQuantity(item.id, 1);
    };

    const handleDecrement = () => {
        if (item.quantity > 1) {
            onUpdateQuantity(item.id, -1);
        }
    };

    return (
        <div className="p-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
                <img
                    src={item.menu.url}
                    alt={item.menu.name}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => {
                        e.target.src = '/api/placeholder/64/64';
                    }}
                />
                <div>
                    <h4 className="font-medium">{item.menu.name}</h4>
                    <p className="text-sm text-gray-600">{item.menu.description}</p>
                    <p className="text-sm font-semibold text-green-600">
                        {formatCurrency(item.menu.price)}
                    </p>
                </div>
            </div>

            <div className="flex items-center space-x-3">
                <button
                    onClick={handleDecrement}
                    disabled={disabled || item.quantity <= 1}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Minus className="w-4 h-4" />
                </button>

                <span className="w-8 text-center font-medium">{item.quantity}</span>

                <button
                    onClick={handleIncrement}
                    disabled={disabled}
                    className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <Plus className="w-4 h-4" />
                </button>

                <div className="text-right ml-4">
                    <p className="font-semibold">
                        {formatCurrency(item.menu.price * item.quantity)}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CartItem;