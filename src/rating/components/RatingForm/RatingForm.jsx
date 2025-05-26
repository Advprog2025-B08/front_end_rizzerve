import React, { useState } from 'react';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

export default function RatingForm({ menuId }) {
    const [rating, setRating] = useState('');
    const [ratingId, setRatingId] = useState('');
    const token = localStorage.getItem('authToken');

    const handleCreate = async () => {
        const userData = JSON.parse(localStorage.getItem('userData'));
        const userId = userData?.userId || userData?.id || 1;

        const response = await fetch(`${API_BASE_URL}/ratings`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                menuId: parseInt(menuId),
                userId: parseInt(userId),
                ratingValue: parseInt(rating)
            }),
        });

        if (!response.ok) {
            console.error('Gagal create rating');
        } else {
            console.log('Rating berhasil ditambahkan');
        }
    };

    const handleUpdate = async () => {
        const response = await fetch(`${API_BASE_URL}/ratings`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id: parseInt(ratingId),
                ratingValue: parseInt(rating)
            }),
        });

        if (!response.ok) {
            console.error('Gagal update rating');
        } else {
            console.log('Rating berhasil diupdate');
        }
    };

    const handleDelete = async () => {
        const response = await fetch(`${API_BASE_URL}/ratings/delete/${ratingId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error('Gagal hapus rating');
        } else {
            console.log('Rating berhasil dihapus');
        }
    };

    return (
        <div>
            <h3>Rating untuk menu {menuId}</h3>

            <label>
                Nilai Rating (1-5):
                <input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    min="1"
                    max="5"
                />
            </label>
            <br />

            <label>
                Rating ID (untuk update / delete):
                <input
                    type="number"
                    value={ratingId}
                    onChange={(e) => setRatingId(e.target.value)}
                    placeholder="Isi jika ingin update/hapus"
                />
            </label>
            <br />

            <button onClick={handleCreate}>Tambah Rating</button>
            <button onClick={handleUpdate}>Update Rating</button>
            <button onClick={handleDelete}>Hapus Rating</button>
        </div>
    );
}
