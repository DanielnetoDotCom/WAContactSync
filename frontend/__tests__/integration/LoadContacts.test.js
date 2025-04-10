import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import mockAxios from '../../__mocks__/api';
import ActionButtons from '../../src/components/ActionButtons';
import ContactTable from '../../src/components/ContactTable';

function TestWrapper() {
  const [contacts, setContacts] = React.useState([]);

  const loadContacts = async () => {
    const res = await mockAxios.get('/contacts');
    setContacts(res.data.contacts);
  };

  return (
    <>
      <ActionButtons
        onSync={() => {}}
        onLoad={loadContacts}
        onReset={() => {}}
        onSyncMore={() => {}}
        loading={false}
      />
      <ContactTable contacts={contacts} loading={false} />
    </>
  );
}

test('loads and displays contacts after clicking Load Contacts', async () => {
  mockAxios.get.mockResolvedValueOnce({
    data: {
      contacts: [
        { name: 'Daniel Neto', phone: '+55', message_count: 2, last_message_date: new Date().toISOString() },
      ],
    },
  });

  render(<TestWrapper />);

  fireEvent.click(screen.getByText(/Load Contacts/i));

  await waitFor(() => {
    expect(screen.getByText('Daniel Neto')).toBeInTheDocument();
  });
});
