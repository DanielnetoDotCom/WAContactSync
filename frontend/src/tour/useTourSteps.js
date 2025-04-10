import { useState } from 'react';

export function useTourSteps() {
  const [runTour, setRunTour] = useState(false);


  const steps = [
    {
      target: '.sync-button',
      content: 'Click here to sync your WhatsApp session. It will restart the QR code.',
    },
    {
      target: '.load-button',
      content: 'Click here to load the contacts and messages already synced.',
    },
    {
      target: '.more-button',
      content: 'This button syncs more messages per contact, fetching up to 100 messages.',
    },
    {
      target: '.reset-button',
      content: 'Use this to reset everything: contacts, messages, and WhatsApp session.',
    },
    {
      target: '.only-known-checkbox',
      content: 'Enable this to include only contacts saved in your phone (not unknown numbers).',
    },
    {
      target: '.exclude-archived-checkbox',
      content: 'Enable this to exclude archived chats from syncing and loading.',
    },
    {
      target: '.status-banner',
      content: 'Here you can see the WhatsApp connection status.',
    },
    {
      target: '.contacts-table',
      content: 'This table displays all synced contacts, message counts, and actions.',
    },
  ];


  return { steps, runTour, setRunTour };
}
