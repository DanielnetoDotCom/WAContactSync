import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import QRSection from '../src/components/QRSection';

test('shows QR code image when status is "waiting-qr"', () => {
  const fakeQR = 'data:image/png;base64,fakebase64';
  render(<QRSection status="waiting-qr" qrCode={fakeQR} />);
  const img = screen.getByAltText(/QR Code/i);
  expect(img).toBeInTheDocument();
  expect(img).toHaveAttribute('src', fakeQR);
});

test('renders nothing when status is not "waiting-qr"', () => {
  const { container } = render(<QRSection status="ready" qrCode={null} />);
  expect(container).toBeEmptyDOMElement();
});
