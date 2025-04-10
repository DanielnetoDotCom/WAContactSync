import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ActionButtons from '../src/components/ActionButtons';

test('calls onSync with correct params', () => {
  const onSync = jest.fn();
  render(
    <ActionButtons
      onSync={onSync}
      onLoad={() => {}}
      onReset={() => {}}
      onSyncMore={() => {}}
      loading={false}
    />
  );

  fireEvent.click(screen.getByText(/Sync WhatsApp/i));
  expect(onSync).toHaveBeenCalledWith(expect.arrayContaining([
    'onlyKnown=true',
    'onlyNotArchived=true',
    'limit=100',
  ]));
});
