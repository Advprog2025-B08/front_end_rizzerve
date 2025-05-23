import { render, screen } from '@testing-library/react';
import RatingAverage from './RatingAverage';
import fetchMock from 'jest-fetch-mock';

beforeEach(() => {
    fetchMock.resetMocks();
});

test('menampilkan rata-rata rating dari API', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ average: 4.5 }));

    render(<RatingAverage menuId={1} />);

    expect(await screen.findByText(/Rata-rata rating menu 1: 4.5/)).toBeInTheDocument();
});
