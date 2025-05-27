// src/services/CheckoutAPI.js
const API_BASE_URL = `${process.env.REACT_APP_API_URL}/api` || 'http://localhost:8080/api';

class CheckoutAPI {
    // Helper method untuk get auth headers
    getAuthHeaders() {
        const token = localStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            ...(token && { 'Authorization': `Bearer ${token}` })
        };
    }

    // Get current user info
    async getCurrentUser() {
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
            credentials: 'include',
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch user data');
        return response.json();
    }

    // Get cart items by user ID
    async getCartItems(userId) {
        const response = await fetch(`${API_BASE_URL}/cart/${userId}/items`, {
            credentials: 'include',
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch cart items');
        return response.json();
    }

    // Create new checkout
    async createCheckout(cartId) {
        const response = await fetch(`${API_BASE_URL}/checkouts`, {
            method: 'POST',
            headers: this.getAuthHeaders(),
            credentials: 'include',
            body: JSON.stringify({ cartId: cartId.toString() })
        });

        if (response.ok) {
            return response.json();
        } else {
            const errorText = await response.text();
            throw new Error(errorText);
        }
    }

    // Get checkout by user ID
    async getCheckoutByUserId(userId) {
        const response = await fetch(`${API_BASE_URL}/checkouts?userId=${userId}`, {
            credentials: 'include',
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Checkout not found');
        return response.json();
    }

    // Get checkout details by ID
    async getCheckoutDetails(checkoutId) {
        const response = await fetch(`${API_BASE_URL}/checkouts/${checkoutId}`, {
            credentials: 'include',
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch checkout details');
        return response.json();
    }

    // Update cart item quantity
    async updateItemQuantity(cartId, itemId, deltaQuantity) {
        const response = await fetch(
            `${API_BASE_URL}/checkouts/${cartId}/items/${itemId}?deltaQuantity=${deltaQuantity}`,
            {
                method: 'PUT',
                credentials: 'include',
                headers: this.getAuthHeaders()
            }
        );

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }
        return response.text();
    }

    // Submit checkout
    async submitCheckout(checkoutId) {
        const response = await fetch(`${API_BASE_URL}/checkouts/${checkoutId}/submit`, {
            method: 'PUT',
            credentials: 'include',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }
        return response.json();
    }

    // Cancel checkout (DELETE)
    async cancelCheckout(checkoutId) {
        const response = await fetch(`${API_BASE_URL}/checkouts/${checkoutId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }
        return response.text();
    }

    // Admin: Get all submitted checkouts
    async getSubmittedCheckouts() {
        const response = await fetch(`${API_BASE_URL}/checkouts/submitted`, {
            credentials: 'include',
            headers: this.getAuthHeaders()
        });
        if (!response.ok) throw new Error('Failed to fetch submitted checkouts');
        return response.json();
    }

    // Admin: Process checkout
    async processCheckout(checkoutId) {
        const response = await fetch(`${API_BASE_URL}/checkouts/${checkoutId}/processed`, {
            method: 'DELETE',
            credentials: 'include',
            headers: this.getAuthHeaders()
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(errorText);
        }
        return response.text();
    }
}

const checkoutAPI = new CheckoutAPI();
export default checkoutAPI;