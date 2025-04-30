import { Link } from 'react-router-dom';
import { getAverageRating } from '../services/api';
import React, { useState, useEffect } from 'react';

const ProductCard = ({ product }) => {
    const [averageRating, setAverageRating] = useState(0);

    useEffect(() => {
        const fetchAverageRating = async () => {
            const avg = await getAverageRating(product.id);
            setAverageRating(avg);
        };

        fetchAverageRating();
    }, [product.id]);

    return (
        <div className="product-card">
            <h3>{product.name}</h3>
            <p>{product.description}</p>
            <div className="product-rating">
                <div className="stars">
                    {[...Array(5)].map((_, i) => (
                        <span key={i} className={i < Math.round(averageRating) ? 'filled' : ''}>
              ★
            </span>
                    ))}
                </div>
                <span>({averageRating.toFixed(1)})</span>
            </div>
            <Link to={`/product/${product.id}`}>View Details</Link>
        </div>
    );
};

export default ProductCard;