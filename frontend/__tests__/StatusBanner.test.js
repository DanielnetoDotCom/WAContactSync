import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import StatusBanner from '../src/components/StatusBanner';

test('shows authenticating message', () => {
  render(<StatusBanner status="authenticating" />);
  expect(screen.getByText(/Syncing contacts/i)).toBeInTheDocument();
});

test('shows ready message', () => {
  render(<StatusBanner status="ready" />);
  expect(screen.getByText(/connected and ready/i)).toBeInTheDocument();
});

test('renders nothing for other statuses', () => {
  const { container } = render(<StatusBanner status="initial" />);
  expect(container).toBeEmptyDOMElement();
});
