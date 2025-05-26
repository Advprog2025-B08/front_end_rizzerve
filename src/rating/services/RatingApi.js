const BASE_URL = `${process.env.REACT_APP_API_URL}/ratings` || 'http://localhost:8080/ratings';

async function authorizedFetch(url, options = {}) {
    const token = localStorage.getItem('authToken');

    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
    };

    return fetch(url, { ...options, headers });
}

export async function getAverageRatingByMenuIdAsync(menuId) {
    const response = await authorizedFetch(`${BASE_URL}/average/${menuId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch average rating');
    }
    return response.json();
}

// Updated function to use the simpler endpoint
export async function getUserRating(userId, menuId) {
    const response = await authorizedFetch(`${BASE_URL}/user-rating?userId=${userId}&menuId=${menuId}`);
    if (response.status === 404) return null;
    if (!response.ok) {
        throw new Error('Failed to fetch user rating');
    }
    return response.json(); // returns { id, ratingValue }
}

export async function createRatingAsync(menuId, userId, ratingValue) {
    const response = await authorizedFetch(BASE_URL, {
        method: 'POST',
        body: JSON.stringify({ menuId, userId, ratingValue })
    });
    if (!response.ok) {
        throw new Error('Failed to create rating');
    }
}

export async function updateRatingAsync(id, menuId, userId, ratingValue) {
    const response = await authorizedFetch(BASE_URL, {
        method: 'PUT',
        body: JSON.stringify({ id, menuId, userId, ratingValue })
    });
    if (!response.ok) {
        throw new Error('Failed to update rating');
    }
    return response.json();
}

export async function deleteRatingAsync(ratingId) {
    const response = await authorizedFetch(`${BASE_URL}/delete/${ratingId}`, {
        method: 'DELETE'
    });
    if (!response.ok) {
        throw new Error('Failed to delete rating');
    }
}