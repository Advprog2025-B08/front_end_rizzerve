import { render, screen, fireEvent } from '@testing-library/react';
import RatingForm from './RatingForm';
import '@testing-library/jest-dom';

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            json: () => Promise.resolve({}),
        })
    );
});

test('user can submit a rating', async () => {
    render(<RatingForm menuId={1} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '4' } });

    const button = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(button);

    expect(fetch).toHaveBeenCalledWith(
        'http://localhost:8080/ratings',
        expect.objectContaining({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                rating: 4,
                menuId: 1,
            }),
        })
    );
});