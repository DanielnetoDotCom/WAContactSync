jest.mock('../src/services/api');

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ContactTable from '../src/components/ContactTable';


const mockContacts = [
  {
    name: 'Daniel Neto',
    phone: '+5511999999999',
    message_count: 5,
    last_message_date: new Date().toISOString(),
  },
  {
    name: 'Vitor',
    phone: '+5511888888888',
    message_count: 3,
    last_message_date: new Date().toISOString(),
  },
];

test('renders table with contacts', () => {
  render(<ContactTable contacts={mockContacts} loading={false} />);
  expect(screen.getByText('Daniel Neto')).toBeInTheDocument();
  expect(screen.getByText('Vitor')).toBeInTheDocument();
  expect(screen.getByText(/Contacts/i)).toBeInTheDocument();
});

test('shows "No contacts found" when list is empty', () => {
  render(<ContactTable contacts={[]} loading={false} />);
  expect(screen.getByText(/No contacts found/i)).toBeInTheDocument();
});

test('renders loading spinner when loading is true', () => {
  render(<ContactTable contacts={[]} loading={true} />);
  expect(screen.getByText(/Loading contacts/i)).toBeInTheDocument();
});

test('filters contacts by name', () => {
  render(<ContactTable contacts={mockContacts} loading={false} />);
  fireEvent.change(screen.getByPlaceholderText(/Search/i), {
    target: { value: 'Vitor' },
  });
  expect(screen.getByText('Vitor')).toBeInTheDocument();
  expect(screen.queryByText('Daniel Neto')).not.toBeInTheDocument();
});
