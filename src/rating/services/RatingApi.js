const BASE_URL = 'http://localhost:8080/ratings';

export async function getAverageRatingByMenuIdAsync(menuId) {
    const response = await fetch(`${BASE_URL}/average/${menuId}`);
    const text = await response.text();
    console.log("Raw response from backend:", text);
    
    if (!response.ok) {
        throw new Error('Gagal fetch average rating');
    }

    return JSON.parse(text);
}

