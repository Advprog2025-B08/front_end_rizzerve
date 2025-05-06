import { render, screen, waitFor } from '@testing-library/react';
import RatingAverage from './RatingAverage';
import fetchMock from 'jest-fetch-mock';

beforeEach(() => {
    fetchMock.resetMocks();
});

test('menampilkan rata-rata rating dari API', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(4.5));

    render(<RatingAverage menuId={1} />);

    await waitFor(() => {
        expect(screen.getByText(/Rata-rata rating:/)).toBeInTheDocument();
        expect(screen.getByText(/4.5/)).toBeInTheDocument();
    });
});
