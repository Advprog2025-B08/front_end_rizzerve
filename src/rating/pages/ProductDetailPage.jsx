import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RatingForm from '../components/RatingForm';
import RatingList from '../components/RatingList';
import axios from 'axios';

// Mock data untuk produk saja
const mockProducts = {
    1: { id: 1, name: 'Nasi Goreng', description: 'Nasi goreng spesial' },
    2: { id: 2, name: 'Mie Ayam', description: 'Mie ayam pangsit' },
    3: { id: 3, name: 'Es Teh', description: 'Es teh manis' }
};

const ProductDetailPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [ratings, setRatings] = useState([]);
    const [editingRating, setEditingRating] = useState(null);
    const [userId] = useState(1); // Mock user ID
    const [error, setError] = useState(null);

    useEffect(() => {
        // Gunakan mock data untuk produk
        setProduct(mockProducts[id]);

        // Tapi ambil ratings dari backend
        const fetchRatings = async () => {
            try {
                const response = await axios.get(`http://localhost:8080/ratings?productId=${id}`);
                setRatings(response.data);
            } catch (err) {
                console.error("Failed to fetch ratings:", err);
                setError("Failed to load ratings");
            }
        };

        fetchRatings();
    }, [id]);

    const handleRatingCreated = async () => {
        try {
            // Refresh ratings dari backend setelah create
            const response = await axios.get(`http://localhost:8080/ratings?productId=${id}`);
            setRatings(response.data);
            setEditingRating(null);
        } catch (err) {
            setError("Failed to refresh ratings after creation");
        }
    };

    const handleRatingDeleted = async () => {
        try {
            // Refresh ratings dari backend setelah delete
            const response = await axios.get(`http://localhost:8080/ratings?productId=${id}`);
            setRatings(response.data);
        } catch (err) {
            setError("Failed to refresh ratings after deletion");
        }
    };

    if (!product) return <div>Loading product...</div>;

    return (
        <div className="product-detail">
            <h1>{product.name}</h1>
            <p>{product.description}</p>

            {error && <div className="error">{error}</div>}

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