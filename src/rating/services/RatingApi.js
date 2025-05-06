const BASE_URL = 'http://localhost:8080/ratings';

export async function getAverageRating(menuId) {
    const response = await fetch(`${BASE_URL}/average/${menuId}`);
    if (!response.ok) {
        throw new Error('Gagal fetch average rating');
    }
    return response.json();
}
