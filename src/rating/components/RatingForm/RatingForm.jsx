import React, { useState } from 'react';

export default function RatingForm({ menuId }) {
    const [rating, setRating] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:8080/ratings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rating: parseInt(rating),
                menuId: parseInt(menuId),
            }),
            credentials: 'include',
            mode: 'cors'
        });
        setRating('');
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Rating untuk menu {menuId}:
                <input
                    type="number"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    min="1"
                    max="5"
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}
