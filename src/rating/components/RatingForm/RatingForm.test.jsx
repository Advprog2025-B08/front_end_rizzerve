import { render, screen, fireEvent } from '@testing-library/react';
import RatingForm from './RatingForm';
import '@testing-library/jest-dom';

global.fetch = jest.fn(() =>
    Promise.resolve({
        ok: true,
        json: () => Promise.resolve({}),
    })
);

test('user can submit a rating', async () => {
    render(<RatingForm />);

    const input = screen.getByLabelText(/rating/i);
    fireEvent.change(input, { target: { value: '4' } });

    const button = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(button);

    expect(fetch).toHaveBeenCalledWith(
        expect.stringContaining('/ratings'),
        expect.objectContaining({
            method: 'POST',
        })
    );
});
