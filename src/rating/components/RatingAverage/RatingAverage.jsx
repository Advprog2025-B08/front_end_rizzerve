import { useEffect, useState } from 'react';
import { getAverageRating } from '../../services/RatingApi';

export default function RatingAverage({ menuId }) {
    const [average, setAverage] = useState(null);

    useEffect(() => {
        getAverageRating(menuId).then(setAverage);
    }, [menuId]);

    if (average === null) {
        return <p>Loading...</p>;
    }

    return (
        <p>Rata-rata rating: {average}</p>
    );
}
