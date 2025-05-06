import { render, screen } from '@testing-library/react';
import RatingAverage from './RatingAverage';
import fetchMock from 'jest-fetch-mock';

beforeEach(() => {
    fetchMock.resetMocks();
});

test('menampilkan rata-rata rating dari API', async () => {
    fetchMock.mockResponseOnce(JSON.stringify(4.5));

    render(<RatingAverage menuId={1} />);

    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    expect(await screen.findByText(/Rata-rata rating:/)).toBeInTheDocument();

    // eslint-disable-next-line testing-library/no-wait-for-multiple-assertions
    expect(await screen.findByText(/4.5/)).toBeInTheDocument();
});
