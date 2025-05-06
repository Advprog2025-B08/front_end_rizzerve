import React, { useState } from 'react';

export default function RatingForm() {
    const [rating, setRating] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        await fetch('http://localhost:8080/ratings', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rating: parseInt(rating) }),
        });
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Rating:
                <input
                    type="number"
                    aria-label="rating"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                />
            </label>
            <button type="submit">Submit</button>
        </form>
    );
}
