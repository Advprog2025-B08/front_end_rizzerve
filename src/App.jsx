import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RatingPage from './rating/components/RatingPage/RatingPage';

export default function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<RatingPage />} />
            </Routes>
        </Router>
    );
}