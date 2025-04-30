import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard';

// Mock data - replace with actual API calls
const mockProducts = [
    { id: 1, name: 'Nasi Goreng', description: 'Nasi goreng spesial dengan telur dan ayam' },
    { id: 2, name: 'Mie Ayam', description: 'Mie ayam dengan pangsit goreng' },
    { id: 3, name: 'Es Teh', description: 'Es teh manis segar' },
    { id: 4, name: 'Jus Alpukat', description: 'Jus alpukat dengan susu kental manis' },
];

const MenuPage = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // In a real app, you would fetch products from your API
        setProducts(mockProducts);
    }, []);

    return (
        <div className="menu-page">
            <h1>Our Menu</h1>
            <div className="product-grid">
                {products.map(product => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default MenuPage;