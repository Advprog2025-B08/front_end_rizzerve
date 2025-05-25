import React, { useState, useEffect, use } from 'react';
import { Star } from 'lucide-react';
import { getAverageRatingByMenuIdAsync } from '../../rating/services/RatingApi';

export default function MenuRating({ menuId }) {
  const [average, setAverage] = useState(null);
  const [userRating, setUserRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (!menuId) return;
    
    const fetchRating = async () => {
      try {
        const avgData = await getAverageRatingByMenuIdAsync(menuId);
        setAverage(avgData?.average || 0);
      } catch (error) {
        console.error('Failed to fetch average rating:', error);
      }
    };

    fetchRating();
  }, [menuId]);

  const handleStarClick = async (rating) => {
    if (!token) return;
    
    setLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('userData'));
      const userId = userData?.userId || userData?.id;
      console.log('user data: ', userData, userId);

      const response = await fetch('http://localhost:8080/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          menuId: parseInt(menuId),
          userId: parseInt(userId),
          ratingValue: rating
        }),
      });

      if (response.ok) {
        setUserRating(rating);
        // Refresh average rating
        const avgData = await getAverageRatingByMenuIdAsync(menuId);
        setAverage(avgData?.average || 0);
      }
    } catch (error) {
      console.error('Failed to submit rating:', error);
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
          } ${loading ? 'cursor-not-allowed opacity-50' : ''}`}
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
        <div className="flex items-center space-x-1">
          <span className="text-xs text-gray-600 mr-2">Rate:</span>
          {renderStars()}
        </div>
      )}
    </div>
  );
}