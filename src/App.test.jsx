import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('menampilkan halaman rating di path /ratings', () => {
  render(
    <MemoryRouter initialEntries={['/ratings']}>
      <App />
    </MemoryRouter>
  );

  expect(screen.getByText(/Halaman Rating/i)).toBeInTheDocument();
});
