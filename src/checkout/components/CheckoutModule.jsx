// src/components/checkout/CheckoutModule.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ShoppingCart, ArrowLeft, Settings } from 'lucide-react';
import { useAuth } from '../../auth/contexts/AuthContext';

// Import checkout components
import UserCheckoutView from './UserCheckoutView';
import AdminCheckoutView from './AdminCheckoutView';
import CheckoutSummary, { CheckoutSummaryStates } from './CheckoutSummary';
import { useCheckout, useAdminCheckout } from '../hooks/useCheckout';
import loading from "../../general/components/ui/Loading";

const CheckoutModule = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { user, isAuthenticated } = useAuth();

    // State untuk menentukan view mode
    const [viewMode, setViewMode] = useState('user'); // 'user' or 'admin'
    const [showSummary, setShowSummary] = useState(true);

    // User checkout hook
    const userCheckout = useCheckout();

    // Admin checkout hook
    const adminCheckout = useAdminCheckout();

    // Determine initial view mode based on user role and URL
    useEffect(() => {
        if (loading) return;

        console.log('AUTH DEBUG → user:', user);
        console.log('AUTH DEBUG → isAuthenticated:', isAuthenticated);
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }

        // Check URL params or user role to determine view
        const urlParams = new URLSearchParams(location.search);
        const adminView = urlParams.get('admin');

        if (adminView === 'true' && user?.role === 'ADMIN') {
            setViewMode('admin');
        } else {
            setViewMode('user');
        }
    }, [user, location, navigate, isAuthenticated]);

    // Handle view mode toggle (only for admin)
    const handleToggleView = () => {
        if (user?.role === 'ADMIN') {
            const newMode = viewMode === 'user' ? 'admin' : 'user';
            setViewMode(newMode);

            // Update URL
            const params = new URLSearchParams(location.search);
            if (newMode === 'admin') {
                params.set('admin', 'true');
            } else {
                params.delete('admin');
            }
            navigate(`${location.pathname}?${params.toString()}`, { replace: true });
        }
    };

    // Handle back navigation
    const handleGoBack = () => {
        if (viewMode === 'admin') {
            navigate('/admin/dashboard');
        } else {
            navigate('/menu'); // or wherever users should go back to
        }
    };

    // Loading state check
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
                    <p className="text-gray-600 mb-4">Please login to access checkout</p>
                    <button
                        onClick={() => navigate('/login')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                    >
                        Go to Login
                    </button>
                </div>
            </div>
        );
    }

    // Render admin view
    if (viewMode === 'admin') {
        return (
            <div className="min-h-screen bg-gray-50">
                {/* Header */}
                <div className="bg-white border-b sticky top-0 z-10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-4">
                                <button
                                    onClick={handleGoBack}
                                    className="p-2 rounded-lg hover:bg-gray-100"
                                >
                                    <ArrowLeft className="w-5 h-5" />
                                </button>
                                <h1 className="text-xl font-semibold">Checkout Management</h1>
                            </div>

                            <div className="flex items-center space-x-4">
                                {user?.role === 'ADMIN' && (
                                    <button
                                        onClick={handleToggleView}
                                        className="flex items-center space-x-2 px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200"
                                    >
                                        <Settings className="w-4 h-4" />
                                        <span>Switch to User View</span>
                                    </button>
                                )}
                                <div className="text-sm text-gray-600">
                                    Welcome, {user?.username}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Admin Content */}
                <AdminCheckoutView
                    submittedCheckouts={adminCheckout.submittedCheckouts}
                    loading={adminCheckout.loading}
                    error={adminCheckout.error}
                    success={adminCheckout.success}
                    fetchSubmittedCheckouts={adminCheckout.fetchSubmittedCheckouts}
                    processCheckout={adminCheckout.processCheckout}
                    clearError={adminCheckout.clearError}
                    clearSuccess={adminCheckout.clearSuccess}
                />
            </div>
        );
    }

    // Render user view
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleGoBack}
                                className="p-2 rounded-lg hover:bg-gray-100"
                            >
                                <ArrowLeft className="w-5 h-5" />
                            </button>
                            <h1 className="text-xl font-semibold">Checkout</h1>
                        </div>

                        <div className="flex items-center space-x-4">
                            {user?.role === 'ADMIN' && (
                                <button
                                    onClick={handleToggleView}
                                    className="flex items-center space-x-2 px-3 py-2 bg-green-100 text-green-700 rounded-lg hover:bg-green-200"
                                >
                                    <Settings className="w-4 h-4" />
                                    <span>Admin View</span>
                                </button>
                            )}

                            {/* Summary Toggle for Mobile */}
                            <button
                                onClick={() => setShowSummary(!showSummary)}
                                className="md:hidden p-2 rounded-lg hover:bg-gray-100"
                            >
                                <ShoppingCart className="w-5 h-5" />
                            </button>

                            <div className="text-sm text-gray-600">
                                Welcome, {user?.username}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Checkout Content */}
                    <div className="lg:col-span-2">
                        <UserCheckoutView
                            cartItems={userCheckout.cartItems}
                            checkoutDetails={userCheckout.checkoutDetails}
                            loading={userCheckout.loading}
                            error={userCheckout.error}
                            success={userCheckout.success}
                            updateItemQuantity={userCheckout.updateItemQuantity}
                            submitCheckout={userCheckout.submitCheckout}
                            cancelCheckout={userCheckout.cancelCheckout}
                            clearError={userCheckout.clearError}
                            clearSuccess={userCheckout.clearSuccess}
                        />
                    </div>

                    {/* Sidebar Summary */}
                    <div className={`lg:col-span-1 ${showSummary ? 'block' : 'hidden lg:block'}`}>
                        <div className="sticky top-24 space-y-4">
                            {/* Main Summary */}
                            {userCheckout.loading && !userCheckout.checkoutDetails ? (
                                <CheckoutSummaryStates.Loading />
                            ) : userCheckout.error && !userCheckout.checkoutDetails ? (
                                <CheckoutSummaryStates.Error
                                    message={userCheckout.error}
                                    onRetry={userCheckout.initializeCheckout}
                                />
                            ) : !userCheckout.cartItems.length ? (
                                <CheckoutSummaryStates.Empty />
                            ) : (
                                <CheckoutSummary
                                    cartItems={userCheckout.cartItems}
                                    totalPrice={userCheckout.checkoutDetails?.totalPrice}
                                    itemCount={userCheckout.cartItems.length}
                                    showDetails={true}
                                />
                            )}

                            {/* Quick Actions */}
                            {userCheckout.checkoutDetails && (
                                <div className="bg-white border rounded-lg p-4">
                                    <h4 className="font-semibold mb-3">Quick Actions</h4>
                                    <div className="space-y-2">
                                        <button
                                            onClick={() => navigate('/menu')}
                                            className="w-full text-left px-3 py-2 text-sm text-blue-600 hover:bg-blue-50 rounded"
                                        >
                                            + Tambah Item Lain
                                        </button>
                                        <button
                                            onClick={() => navigate('/orders')}
                                            className="w-full text-left px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded"
                                        >
                                            📝 Lihat Riwayat Pesanan
                                        </button>
                                    </div>
                                </div>
                            )}

                            {/* Help Section */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <h4 className="font-semibold text-blue-900 mb-2">Butuh Bantuan?</h4>
                                <p className="text-sm text-blue-800 mb-3">
                                    Hubungi customer service jika ada pertanyaan tentang pesanan Anda.
                                </p>
                                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                                    Contact Support →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutModule;