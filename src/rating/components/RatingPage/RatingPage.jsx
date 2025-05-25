import React, { useState } from 'react';
import RatingForm from '../RatingForm/RatingForm';
import RatingAverage from '../RatingAverage/RatingAverage';

export default function RatingPage() {
    const [menuId, setMenuId] = useState('');

    return (
        <div>
            <h1>Halaman Rating</h1>
            <label>
                Menu ID:
                <input
                    type="number"
                    value={menuId}
                    onChange={e => setMenuId(e.target.value)}
                />
            </label>

            {menuId && (
                <>
                    <RatingAverage menuId={menuId} />
                    <RatingForm menuId={menuId} />
                </>
            )}
        </div>
    );
}
