import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('menampilkan halaman rating di root path', () => {
    render(<App />);
    expect(screen.getByText(/Halaman Rating/i)).toBeInTheDocument();
});