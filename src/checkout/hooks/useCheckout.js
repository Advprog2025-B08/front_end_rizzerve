// src/hooks/useCheckout.js
import {useEffect, useRef, useState} from 'react';
import checkoutAPI from '../services/CheckoutApi';
import {useAuth} from '../../auth/contexts/AuthContext';
import {redirect} from "react-router-dom";

export const useCheckout = () => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);
    const [checkoutDetails, setCheckoutDetails] = useState(null);
    const [cartId, setCartId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const initializeCheckout = async () => {
        if (!user) return;

        setLoading(true);
        setError('');

        try {
            const userData = await checkoutAPI.getCurrentUser();
            user.id = userData.id;

            console.log('Initializing checkout for user:', user.id, user.username, user.email, user.role);

            let existingCheckout = null;

            // Cek apakah sudah ada checkout — tangani jika tidak ditemukan
            try {
                existingCheckout = await checkoutAPI.getCheckoutByUserId(user.id);
            } catch (err) {
                if (err.message.includes('not found') || err.status === 404) {
                    console.log('Checkout tidak ditemukan, akan lanjut buat baru.');
                } else {
                    throw err; // Kalau error lain, lempar lagi
                }
            }

            if (existingCheckout) {
                console.log('Found existing checkout:', existingCheckout);
                const items = await checkoutAPI.getCartItems(user.id);
                const fetchedCartId = items[0].cartId;
                const checkoutDetails = await checkoutAPI.getCheckoutDetails(existingCheckout.id);

                setCartId(fetchedCartId);
                setCartItems(items);
                setCheckoutDetails(checkoutDetails);
                return;
            }

            // Kalau belum ada checkout, lanjut fetch cart items
            const items = await checkoutAPI.getCartItems(user.id);
            console.log('Fetched cart items:', items);
            if (!items || items.length === 0) {
                setError('Keranjang kosong atau tidak ditemukan');
                return;
            }

            setCartItems(items);
            const fetchedCartId = items[0].cartId;
            setCartId(fetchedCartId);

            // Buat checkout baru
            const newCheckout = await checkoutAPI.createCheckout(fetchedCartId);
            const checkoutId = newCheckout.id;

            const details = await checkoutAPI.getCheckoutDetails(checkoutId);
            setCheckoutDetails(details);

        } catch (err) {
            console.error('Error initializing checkout:', err);
            setError(err.message || 'Terjadi kesalahan saat memuat checkout');
        } finally {
            setLoading(false);
        }
    };



    // Update item quantity
    const updateItemQuantity = async (itemId, deltaQuantity) => {
        if (!cartId || !checkoutDetails) return;
        console.log('Updating item quantity:', itemId, deltaQuantity, cartId);
        try {
            await checkoutAPI.updateItemQuantity(cartId, itemId, deltaQuantity);

            // Refresh data
            const updatedItems = await checkoutAPI.getCartItems(user.id);
            const updatedDetails = await checkoutAPI.getCheckoutDetails(checkoutDetails.id);

            setCartItems(updatedItems);
            setCheckoutDetails(updatedDetails);
            setSuccess('Quantity berhasil diupdate');
            setTimeout(() => setSuccess(''), 3000);

        } catch (err) {
            console.error('Error updating quantity:', err);
            setError(err.message);
        }
    };

    // Submit checkout
    const submitCheckout = async () => {
        if (!checkoutDetails) return;

        setLoading(true);
        try {
            await checkoutAPI.submitCheckout(checkoutDetails.id);

            // Refresh checkout details
            const updatedDetails = await checkoutAPI.getCheckoutDetails(checkoutDetails.id);
            setCheckoutDetails(updatedDetails);
            setSuccess('Checkout berhasil disubmit! Menunggu proses admin.');
            setTimeout(() => setSuccess(''), 5000);

        } catch (err) {
            console.error('Error submitting checkout:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Cancel checkout
    const cancelCheckout = async () => {
        if (!checkoutDetails || !window.confirm('Yakin ingin membatalkan checkout?')) return;

        setLoading(true);
        try {
            await checkoutAPI.cancelCheckout(checkoutDetails.id);

            // Reset state
            setCartId(null);
            setCheckoutDetails(null);
            setCartItems([]);
            setSuccess('Checkout berhasil dibatalkan');
            setTimeout(() => {
                setSuccess('');
                redirect('/pesanan');
            }, 2000);

        } catch (err) {
            console.error('Error canceling checkout:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Clear messages
    const clearError = () => setError('');
    const clearSuccess = () => setSuccess('');
    const hasInitialized = useRef(false);
    // Auto-initialize when user is available
    useEffect(() => {
        if (user && !hasInitialized.current) {
            hasInitialized.current = true;
            initializeCheckout();
        }
    }, [user]);

    return {
        // State
        cartItems,
        checkoutDetails,
        cartId,
        loading,
        error,
        success,

        // Actions
        initializeCheckout,
        updateItemQuantity,
        submitCheckout,
        cancelCheckout,
        clearError,
        clearSuccess
    };
};

export const useAdminCheckout = () => {
    const [submittedCheckouts, setSubmittedCheckouts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Fetch submitted checkouts
    const fetchSubmittedCheckouts = async () => {
        setLoading(true);
        try {
            const checkouts = await checkoutAPI.getSubmittedCheckouts();
            setSubmittedCheckouts(checkouts);
        } catch (err) {
            console.error('Error fetching submitted checkouts:', err);
            setError('Gagal memuat data checkout');
        } finally {
            setLoading(false);
        }
    };

    // Process checkout
    const processCheckout = async (checkoutId) => {
        if (!window.confirm('Yakin ingin memproses checkout ini?')) return;

        try {
            await checkoutAPI.processCheckout(checkoutId);
            setSuccess('Checkout berhasil diproses dan dihapus');
            await fetchSubmittedCheckouts(); // Refresh list
            setTimeout(() => setSuccess(''), 3000);

        } catch (err) {
            console.error('Error processing checkout:', err);
            setError(err.message);
        }
    };

    // Clear messages
    const clearError = () => setError('');
    const clearSuccess = () => setSuccess('');

    // Auto-fetch on mount
    useEffect(() => {
        fetchSubmittedCheckouts();
    }, []);

    return {
        // State
        submittedCheckouts,
        loading,
        error,
        success,

        // Actions
        fetchSubmittedCheckouts,
        processCheckout,
        clearError,
        clearSuccess
    };
};