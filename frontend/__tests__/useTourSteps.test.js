import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useTourSteps } from '../src/tour/useTourSteps';

function TestComponent() {
  const { runTour, setRunTour } = useTourSteps();

  return (
    <div>
      <span data-testid="status">{runTour ? 'ON' : 'OFF'}</span>
      <button onClick={() => setRunTour(true)}>Start Tour</button>
    </div>
  );
}

test('should toggle runTour state', () => {
  render(<TestComponent />);
  expect(screen.getByTestId('status')).toHaveTextContent('OFF');
  fireEvent.click(screen.getByText('Start Tour'));
  expect(screen.getByTestId('status')).toHaveTextContent('ON');
});
