// src/components/checkout/CheckoutSummary.jsx
import React from 'react';
import { Calculator, ShoppingBag, Receipt } from 'lucide-react';
import { formatCurrency } from '../utils/currency';

const CheckoutSummary = ({
                             cartItems = [],
                             totalPrice = 0,
                             itemCount = 0,
                             showDetails = true,
                             className = ''
                         }) => {
    // Calculate subtotal, tax, and other fees
    const subtotal = cartItems.reduce((sum, item) => sum + (item.menu.price * item.quantity), 0);
    const taxRate = 0.1; // 10% tax
    const taxAmount = subtotal * taxRate;
    const serviceCharge = 2000; // Fixed service charge
    const calculatedTotal = subtotal + taxAmount + serviceCharge;

    // Use provided totalPrice or calculated total
    const finalTotal = totalPrice || calculatedTotal;

    if (!showDetails) {
        return (
            <div className={`bg-gray-50 border rounded-lg p-4 ${className}`}>
                <div className="flex justify-between items-center">
                    <div className="flex items-center">
                        <ShoppingBag className="w-5 h-5 text-gray-600 mr-2" />
                        <span className="font-medium">{itemCount} item{itemCount !== 1 ? 's' : ''}</span>
                    </div>
                    <div className="text-xl font-bold text-green-600">
                        {formatCurrency(finalTotal)}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`bg-white border rounded-lg ${className}`}>
            <div className="p-4 border-b">
                <h3 className="text-lg font-semibold flex items-center">
                    <Receipt className="w-5 h-5 mr-2" />
                    Ringkasan Pesanan
                </h3>
            </div>

            <div className="p-4 space-y-4">
                {/* Items Summary */}
                <div className="space-y-3">
                    <h4 className="font-medium text-gray-900">Detail Item ({itemCount})</h4>
                    {cartItems.map((item) => (
                        <div key={item.id} className="flex justify-between items-center">
                            <div className="flex-1">
                                <p className="font-medium">{item.menu.name}</p>
                                <div className="flex items-center text-sm text-gray-600">
                                    <span>{formatCurrency(item.menu.price)}</span>
                                    <span className="mx-2">×</span>
                                    <span>{item.quantity}</span>
                                </div>
                            </div>
                            <div className="font-semibold">
                                {formatCurrency(item.menu.price * item.quantity)}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Price Breakdown */}
                <div className="border-t pt-4 space-y-2">
                    <div className="flex justify-between text-gray-600">
                        <span>Subtotal</span>
                        <span>{formatCurrency(subtotal)}</span>
                    </div>

                    <div className="border-t pt-2 flex justify-between items-center text-lg font-bold">
                        <span>Total</span>
                        <span className="text-green-600">{formatCurrency(finalTotal)}</span>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="bg-blue-50 rounded-lg p-3 mt-4">
                    <div className="flex items-start">
                        <Calculator className="w-4 h-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                        <div className="text-sm text-blue-800">
                            <p className="font-medium mb-1">Informasi Pembayaran</p>
                            <ul className="space-y-1 text-blue-700">
                                <li>• Harga sudah termasuk pajak dan biaya layanan</li>
                                <li>• Pembayaran akan diproses setelah konfirmasi admin</li>
                                <li>• Pesanan dapat dibatalkan sebelum disubmit</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Compact version for sidebar or mobile
export const CheckoutSummaryCompact = ({
                                           itemCount = 0,
                                           totalPrice = 0,
                                           onViewDetails,
                                           className = ''
                                       }) => {
    return (
        <div className={`bg-white border rounded-lg p-4 ${className}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-600">
                        {itemCount} item{itemCount !== 1 ? 's' : ''} dalam keranjang
                    </p>
                    <p className="text-lg font-bold text-green-600">
                        {formatCurrency(totalPrice)}
                    </p>
                </div>
                {onViewDetails && (
                    <button
                        onClick={onViewDetails}
                        className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                    >
                        Lihat Detail
                    </button>
                )}
            </div>
        </div>
    );
};

// Summary for different states
export const CheckoutSummaryStates = {
    // Empty state
    Empty: ({ className = '' }) => (
        <div className={`bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center ${className}`}>
            <ShoppingBag className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Keranjang Kosong</h3>
            <p className="text-gray-600">Tambahkan item untuk mulai checkout</p>
        </div>
    ),

    // Loading state
    Loading: ({ className = '' }) => (
        <div className={`bg-white border rounded-lg p-6 ${className}`}>
            <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="space-y-2">
                    <div className="h-3 bg-gray-200 rounded"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
                <div className="border-t pt-4">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                </div>
            </div>
        </div>
    ),

    // Error state
    Error: ({ message = 'Terjadi kesalahan', onRetry, className = '' }) => (
        <div className={`bg-red-50 border border-red-200 rounded-lg p-6 text-center ${className}`}>
            <div className="text-red-600 mb-3">
                <Calculator className="w-8 h-8 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-red-900 mb-2">Gagal Memuat Summary</h3>
            <p className="text-red-700 mb-4">{message}</p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                >
                    Coba Lagi
                </button>
            )}
        </div>
    )
};

export default CheckoutSummary;