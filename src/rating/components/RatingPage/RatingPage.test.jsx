import { render, screen} from '@testing-library/react';
import RatingPage from './RatingPage';

beforeEach(() => {
    global.fetch = jest.fn(() =>
        Promise.resolve({
            ok: true,
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

test('menampilkan rata-rata rating', async () => {
    render(<RatingPage />);
    expect(screen.getByLabelText(/Rating:/i)).toBeInTheDocument();
    const rataRata = await screen.findByText(/Rata-rata rating:/i);
    expect(rataRata).toBeInTheDocument();
});
