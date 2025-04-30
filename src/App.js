import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MenuPage from './rating/pages/MenuPage';
import ProductDetailPage from './rating/pages/ProductDetailPage';

function App() {
  return (
      <Router>
        <Routes>
          <Route path="/" element={<MenuPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
        </Routes>
      </Router>
  );
}

export default App;