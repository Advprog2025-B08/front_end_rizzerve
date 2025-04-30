import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RatingForm from '../components/RatingForm';
import RatingList from '../components/RatingList';

// Mock data - replace with actual API calls
const mockProduct = {
    id: 1,
    name: 'Nasi Goreng',
    description: 'Nasi goreng spesial dengan telur dan ayam',
};

const mockRatings = [
    { id: 1, user: { id: 1, name: 'User 1' }, product: { id: 1 }, ratingValue: 4 },
    { id: 2, user: { id: 2, name: 'User 2' }, product: { id: 1 }, ratingValue: 5 },
];

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [editingRating, setEditingRating] = useState(null);
    const [userId] = useState(1); // In a real app, this would come from auth context

    useEffect(() => {
        // In a real app, you would fetch product and ratings from your API
        setProduct(mockProduct);
        setRatings(mockRatings.filter(r => r.product.id === parseInt(id)));
    }, [id]);

    const handleRatingCreated = () => {
        // In a real app, you would refetch ratings
        alert('Rating created successfully!');
        setEditingRating(null);
    };

    const handleRatingDeleted = () => {
        // In a real app, you would refetch ratings
        alert('Rating deleted successfully!');
    };

    if (!product) return <div>Loading...</div>;

    return (
        <div className="product-detail">
            <h1>{product.name}</h1>
            <p>{product.description}</p>

            <RatingList
                productId={product.id}
                userId={userId}
                ratings={ratings}
                onRatingDeleted={handleRatingDeleted}
                onRatingUpdated={setEditingRating}
            />

            <RatingForm
                productId={product.id}
                userId={userId}
                initialRating={editingRating}
                onSuccess={handleRatingCreated}
            />
        </div>
    );
};

export default ProductDetailPage;