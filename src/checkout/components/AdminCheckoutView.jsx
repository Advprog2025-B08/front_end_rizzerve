// src/components/checkout/AdminCheckoutView.jsx
import React from 'react';
import { Package, Eye, Check } from 'lucide-react';
import { useAdminCheckout } from '../hooks/useCheckout';
import { formatCurrency } from '../utils/currency';
import { ErrorAlert, SuccessAlert, LoadingSpinner } from './common/Alerts';

const AdminCheckoutView = () => {
    const {
        submittedCheckouts,
        loading,
        error,
        success,
        fetchSubmittedCheckouts,
        processCheckout,
        clearError,
        clearSuccess
    } = useAdminCheckout();

    const handleViewDetails = (checkout) => {
        alert(`Checkout Details:\nID: ${checkout.id}\nUser: ${checkout.userId}\nCart: ${checkout.cartId}\nTotal: ${formatCurrency(checkout.totalPrice)}\nCreated: ${new Date(checkout.createdAt).toLocaleString()}`);
    };

    return (
        <div className="max-w-6xl mx-auto p-6 bg-white">
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
                    <Package className="mr-3" />
                    Admin - Checkout Management
                </h1>
                <p className="text-gray-600">Kelola checkout yang sudah disubmit</p>
            </div>

            {error && <ErrorAlert message={error} onClose={clearError} />}
            {success && <SuccessAlert message={success} onClose={clearSuccess} />}

            {loading && <LoadingSpinner />}

            <div className="bg-white border rounded-lg">
                <div className="p-4 border-b flex justify-between items-center">
                    <h3 className="text-lg font-semibold">Checkout Tersubmit</h3>
                    <button
                        onClick={fetchSubmittedCheckouts}
                        disabled={loading}
                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
                    >
                        Refresh
                    </button>
                </div>

                {submittedCheckouts.length === 0 ? (
                    <div className="p-8 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada checkout tersubmit</h3>
                        <p className="text-gray-600">Semua checkout sudah diproses atau belum ada yang submit</p>
                    </div>
                ) : (
                    <div className="divide-y">
                        {submittedCheckouts.map((checkout) => (
                            <div key={checkout.id} className="p-4 hover:bg-gray-50">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-4">
                                            <div>
                                                <h4 className="font-semibold">Checkout #{checkout.id}</h4>
                                                <p className="text-sm text-gray-600">User ID: {checkout.userId}</p>
                                                <p className="text-sm text-gray-600">Cart ID: {checkout.cartId}</p>
                                            </div>
                                            <div>
                                                <p className="font-semibold text-green-600">
                                                    {formatCurrency(checkout.totalPrice)}
                                                </p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(checkout.createdAt).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleViewDetails(checkout)}
                                            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 flex items-center"
                                        >
                                            <Eye className="w-4 h-4 mr-1" />
                                            View
                                        </button>

                                        <button
                                            onClick={() => processCheckout(checkout.id)}
                                            className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 flex items-center"
                                        >
                                            <Check className="w-4 h-4 mr-1" />
                                            Process
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminCheckoutView;