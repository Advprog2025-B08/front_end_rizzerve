// App.jsx
import { Routes, Route } from 'react-router-dom';
import RatingPage from './rating/components/RatingPage/RatingPage';

export default function App() {
    return (
        <Routes>
            <Route path="/ratings" element={<RatingPage />} />
        </Routes>
    );
}