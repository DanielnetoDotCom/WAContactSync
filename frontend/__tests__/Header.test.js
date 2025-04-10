import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import Header from '../src/components/Header';

test('renders app title', () => {
  render(<Header />);
  expect(screen.getByText(/WhatsApp Contact Sync/i)).toBeInTheDocument();
});
