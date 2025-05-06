import React, { useState } from 'react';
import ProductCard from '../components/ProductCard';

// Mock data untuk menu
const mockProducts = [
    { id: 1, name: 'Nasi Goreng', description: 'Nasi goreng spesial' },
    { id: 2, name: 'Mie Ayam', description: 'Mie ayam pangsit' },
    { id: 3, name: 'Es Teh', description: 'Es teh manis' }
];

const MenuPage = () => {
    const [products] = useState(mockProducts); // Tetap gunakan mock data

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