const BASE_URL = 'http://localhost:8080/ratings';

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
    const text = await response.text();

    if (!response.ok) {
        throw new Error('Gagal fetch average rating');
    }

    return JSON.parse(text);
}


