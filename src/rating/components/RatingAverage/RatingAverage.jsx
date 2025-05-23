import { useEffect, useState } from 'react';
import { getAverageRatingByMenuIdAsync } from '../../services/RatingApi';

export default function RatingAverage({ menuId }) {
    const [average, setAverage] = useState(null);

    useEffect(() => {
        if (!menuId) return;
        getAverageRatingByMenuIdAsync(menuId).then(setAverage);
    }, [menuId]);

    if (average === null) {
        return <p>Loading...</p>;
    }

    return (
        <p>Rata-rata rating menu {menuId}: {average?.average ?? 'Tidak tersedia'}</p>
    );    
}
