import React, { useState, useEffect } from 'react';
import { deleteRating, getAverageRating } from '../services/api';

const RatingList = ({ productId, userId, ratings, onRatingDeleted, onRatingUpdated }) => {
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchAverageRating = async () => {
            const avg = await getAverageRating(productId);
            setAverageRating(avg);
        };

        fetchAverageRating();
    }, [productId, ratings]);

    const handleDelete = async (ratingId) => {
        try {
            await deleteRating(ratingId);
            onRatingDeleted();
        } catch (error) {
            console.error('Error deleting rating:', error);
        }
    };

    const userRating = ratings.find(r => r.user.id === userId);

    return (
        <div className="rating-list">
            <div className="average-rating">
                <h3>Average Rating: {averageRating.toFixed(1)}</h3>
                <div className="stars">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(averageRating) ? 'filled' : ''}>
              ★
            </span>
                    ))}
                </div>
            </div>

            {userRating && (
                <div className="user-rating">
                    <h4>Your Rating:</h4>
                    <div className="stars">
                        {[...Array(5)].map((_, i) => (
                            <span key={i} className={i < userRating.ratingValue ? 'filled' : ''}>
                ★
              </span>
                        ))}
                    </div>
                    <button onClick={() => onRatingUpdated(userRating)}>Edit</button>
                    <button onClick={() => handleDelete(userRating.id)}>Delete</button>
                </div>
            )}
        </div>
    );
};

export default RatingList;