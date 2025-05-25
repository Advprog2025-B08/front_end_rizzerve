import { render, screen, fireEvent } from '@testing-library/react';
import RatingPage from './RatingPage';

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
            text: () => Promise.resolve(JSON.stringify({ average: 4.5 })),
            json: () => Promise.resolve({ average: 4.5 }),
        })
    );
});

afterEach(() => {
    jest.restoreAllMocks();
});

test('menampilkan judul halaman', () => {
    render(<RatingPage />);
    expect(screen.getByText(/Halaman Rating/i)).toBeInTheDocument();
});

test('menampilkan rata-rata rating setelah input menuId', async () => {
    render(<RatingPage />);

    const input = screen.getByLabelText(/Menu ID:/i);
    fireEvent.change(input, { target: { value: '1' } });

    const rataRata = await screen.findByText(/Rata-rata rating menu 1: 4.5/i);
    expect(rataRata).toBeInTheDocument();
});
