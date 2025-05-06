import React, { useEffect, useState } from 'react';
import { getAverageRating } from '../../services/RatingApi';

export default function RatingPage() {
    const [averageRating, setAverageRating] = useState(null);

    useEffect(() => {
        getAverageRating().then(data => {
            setAverageRating(data.average);
        });
    }, []);

    return (
        <div>
            <h1>Halaman Rating</h1>
            <form>
                <label>
                    Rating:
                    <input type="number" aria-label="rating" />
                </label>
                <button type="submit">Submit</button>
            </form>
            {averageRating !== null ? (
                <p>Rata-rata rating: {averageRating}</p>
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
}
