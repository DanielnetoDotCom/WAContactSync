import { useState } from 'react';

export function useTourSteps() {
  const [runTour, setRunTour] = useState(false);

  const steps = [
    { target: '.sync-button', content: 'Click here to sync WhatsApp.' },
    { target: '.load-button', content: 'Click to load your contacts.' },
    { target: '.reset-button', content: 'This resets everything.' },
    { target: '.status-banner', content: 'Shows WhatsApp connection status.' },
  ];

  return { steps, runTour, setRunTour };
}
