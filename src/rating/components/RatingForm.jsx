import React, { useState } from 'react';
import { createRating, updateRating } from '../services/api';

const RatingForm = ({ productId, userId, initialRating = null, onSuccess }) => {
    const [ratingValue, setRatingValue] = useState(initialRating?.ratingValue || 0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const ratingData = {
                id: initialRating?.id || null,
                user: { id: userId },
                product: { id: productId },
                ratingValue: ratingValue
            };

            if (initialRating) {
                await updateRating(ratingData);
            } else {
                await createRating(ratingData);
            }

            onSuccess();
        } catch (error) {
            console.error('Error submitting rating:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="rating-form">
            <h3>{initialRating ? 'Update Rating' : 'Add Rating'}</h3>
            <form onSubmit={handleSubmit}>
                <div className="star-rating">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <React.Fragment key={star}>
                            <input
                                type="radio"
                                id={`star-${star}`}
                                name="rating"
                                value={star}
                                checked={ratingValue === star}
                                onChange={() => setRatingValue(star)}
                            />
                            <label htmlFor={`star-${star}`} title={`${star} star`}>
                                ★
                            </label>
                        </React.Fragment>
                    ))}
                </div>
                <button type="submit" disabled={isSubmitting || ratingValue === 0}>
                    {isSubmitting ? 'Submitting...' : initialRating ? 'Update' : 'Submit'}
                </button>
            </form>
        </div>
    );
};

export default RatingForm;