import React, { useState, useEffect } from 'react';
import { Star, Trash2 } from 'lucide-react';
import {
    getAverageRatingByMenuIdAsync,
    getUserRating,
    createRatingAsync,
    updateRatingAsync,
    deleteRatingAsync
} from '../../rating/services/RatingApi';

export default function MenuRating({ menuId }) {
    const [average, setAverage] = useState(0);
    const [userRating, setUserRating] = useState(0);
    const [ratingId, setRatingId] = useState(null);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem('authToken');
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    const userId = userData?.userId || userData?.id;

    useEffect(() => {
        if (!menuId) return;

        const fetchData = async () => {
            try {
                // Fetch average rating
                const avgData = await getAverageRatingByMenuIdAsync(menuId);
                setAverage(avgData?.average || 0);

                // Check if user already has a rating for this menu
                if (token && userId) {
                    const userRatingData = await getUserRating(userId, menuId);
                    if (userRatingData) {
                        setRatingId(userRatingData.id);
                        setUserRating(userRatingData.ratingValue);
                    } else {
                        setRatingId(null);
                        setUserRating(0);
                    }
                }
            } catch (error) {
                console.error('Failed to fetch rating data:', error);
            }
        };

        fetchData();
    }, [menuId, token, userId]);

    const refreshData = async () => {
        try {
            const avgData = await getAverageRatingByMenuIdAsync(menuId);
            setAverage(avgData?.average || 0);
        } catch (error) {
            console.error('Failed to refresh average rating:', error);
        }
    };

    const handleStarClick = async (rating) => {
        if (!token || !userId) return;

        setLoading(true);
        try {
            if (ratingId) {
                // Update existing rating
                await updateRatingAsync(ratingId, menuId, userId, rating);
                console.log('Rating updated successfully');
            } else {
                // Create new rating
                await createRatingAsync(menuId, userId, rating);
                console.log('Rating created successfully');
                
                // Get the new rating data
                const newRatingData = await getUserRating(userId, menuId);
                if (newRatingData) {
                    setRatingId(newRatingData.id);
                }
            }

            setUserRating(rating);
            await refreshData();
        } catch (error) {
            console.error('Failed to save rating:', error);
            // If there was an error, refresh the data to get the current state
            try {
                const userRatingData = await getUserRating(userId, menuId);
                if (userRatingData) {
                    setRatingId(userRatingData.id);
                    setUserRating(userRatingData.ratingValue);
                } else {
                    setRatingId(null);
                    setUserRating(0);
                }
            } catch (refreshError) {
                console.error('Failed to refresh user rating after error:', refreshError);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteRating = async () => {
        if (!token || !userId || !ratingId) return;

        if (!window.confirm('Are you sure you want to delete your rating?')) return;

        setLoading(true);
        try {
            // Use the rating ID for deletion
            await deleteRatingAsync(ratingId);
            setRatingId(null);
            setUserRating(0);
            await refreshData();
            console.log('Rating deleted successfully');
        } catch (error) {
            console.error('Failed to delete rating:', error);
        } finally {
            setLoading(false);
        }
    };

    const renderStars = () => {
        return [...Array(5)].map((_, index) => {
            const starValue = index + 1;
            const isFilled = starValue <= (hoveredStar || userRating);

            return (
                <Star
                    key={index}
                    className={`w-4 h-4 cursor-pointer transition-colors ${
                        isFilled ? 'text-yellow-400 fill-current' : 'text-gray-300'
                    } ${loading ? 'cursor-not-allowed opacity-50' : 'hover:text-yellow-300'}`}
                    onMouseEnter={() => !loading && setHoveredStar(starValue)}
                    onMouseLeave={() => !loading && setHoveredStar(0)}
                    onClick={() => !loading && handleStarClick(starValue)}
                />
            );
        });
    };

    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                    Average: {average ? average.toFixed(1) : 'N/A'}
                </span>
                <div className="flex items-center space-x-1">
                    <Star className="w-3 h-3 text-yellow-400 fill-current" />
                    <span className="text-xs text-gray-500">
                        {average ? average.toFixed(1) : '0'}
                    </span>
                </div>
            </div>

            {token && (
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                        <span className="text-xs text-gray-600 mr-2">Your rating:</span>
                        {renderStars()}
                        {userRating > 0 && (
                            <span className="text-xs text-gray-500 ml-2">
                                ({userRating}/5)
                            </span>
                        )}
                    </div>
                    
                    {ratingId && !loading && (
                        <button
                            onClick={handleDeleteRating}
                            className="text-red-500 hover:text-red-700 p-1"
                            title="Delete your rating"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    )}
                </div>
            )}

            {loading && (
                <div className="text-xs text-gray-500">
                    Processing...
                </div>
            )}
        </div>
    );
}