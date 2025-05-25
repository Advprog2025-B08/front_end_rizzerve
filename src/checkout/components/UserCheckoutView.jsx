// src/components/checkout/UserCheckoutView.jsx
import React from 'react';
import { ShoppingCart, CreditCard, Trash2, Clock } from 'lucide-react';
import CartItem from './CartItem';
import { useCheckout } from '../hooks/useCheckout';
import { formatCurrency } from '../utils/currency';
import { ErrorAlert, SuccessAlert, LoadingSpinner } from './common/Alerts';

const UserCheckoutView = () => {
    const {
        cartItems,
        checkoutDetails,
        loading,
        error,
        success,
        updateItemQuantity,
        submitCheckout,
        cancelCheckout,
        clearError,
        clearSuccess
    } = useCheckout();

    if (loading && !checkoutDetails) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <LoadingSpinner />
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto p-6 bg-white">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                    <ShoppingCart className="mr-3" />
                    Checkout
                </h1>
                <p className="text-gray-600">Review pesanan Anda sebelum melakukan pembayaran</p>
            </div>

            {error && <ErrorAlert message={error} onClose={clearError} />}
            {success && <SuccessAlert message={success} onClose={clearSuccess} />}

            {checkoutDetails ? (
                <div className="space-y-6">
                    {/* Checkout Status */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-semibold text-blue-900">Status Checkout</h3>
                                <p className="text-blue-700">
                                    {checkoutDetails.isSubmitted
                                        ? 'Sudah disubmit - Menunggu proses admin'
                                        : 'Belum disubmit'}
                                </p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-blue-600">Checkout ID: {checkoutDetails.id}</p>
                                <p className="text-sm text-blue-600">
                                    Dibuat: {new Date(checkoutDetails.createdAt).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Cart Items */}
                    <div className="bg-white border rounded-lg">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold">Item Pesanan</h3>
                        </div>
                        <div className="divide-y">
                            {cartItems.map((item) => (
                                <CartItem
                                    key={item.id}
                                    item={item}
                                    onUpdateQuantity={updateItemQuantity}
                                    disabled={checkoutDetails.isSubmitted}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Total & Actions */}
                    <div className="bg-gray-50 border rounded-lg p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-semibold">Total Pembayaran</h3>
                            <p className="text-2xl font-bold text-green-600">
                                {formatCurrency(checkoutDetails.totalPrice)}
                            </p>
                        </div>

                        <div className="flex space-x-4">
                            {!checkoutDetails.isSubmitted ? (
                                <>
                                    <button
                                        onClick={submitCheckout}
                                        disabled={loading}
                                        className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                                    >
                                        <CreditCard className="w-5 h-5 mr-2" />
                                        Submit Checkout
                                    </button>

                                    <button
                                        onClick={cancelCheckout}
                                        disabled={loading}
                                        className="bg-red-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                                    >
                                        <Trash2 className="w-5 h-5 mr-2" />
                                        Cancel
                                    </button>
                                </>
                            ) : (
                                <div className="flex-1 bg-blue-100 text-blue-800 py-3 px-6 rounded-lg font-semibold text-center flex items-center justify-center">
                                    <Clock className="w-5 h-5 mr-2" />
                                    Menunggu Proses Admin
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            ) : !loading && !error && (
                <div className="text-center py-12">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada checkout aktif</h3>
                    <p className="text-gray-600">Tambahkan item ke keranjang untuk mulai checkout</p>
                </div>
            )}
        </div>
    );
};

export default UserCheckoutView;