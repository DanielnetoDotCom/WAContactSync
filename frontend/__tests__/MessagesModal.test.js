
jest.mock('../src/services/api');
import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MessagesModal from '../src/components/MessagesModal';
import axios from '../src/services/api'; // usa o mock corretamente
import { act } from 'react';



const fakeMessages = [
  {
    id: 'msg1',
    timestamp: Math.floor(Date.now() / 1000),
    body: 'Hello Daniel!',
  },
  {
    id: 'msg2',
    timestamp: Math.floor(Date.now() / 1000),
    body: 'Tudo certo!',
  },
];

test('renders loading state initially', async () => {
  axios.get.mockResolvedValue({ data: { messages: [] } });

  render(<MessagesModal phone="+55" onClose={() => {}} />);

  // ✅ Verifica estado inicial imediatamente
  expect(screen.getByText(/Loading messages/i)).toBeInTheDocument();

  // ✅ Aguarda renderização final
  await waitFor(() => {
    expect(screen.getByText(/No messages found/i)).toBeInTheDocument();
  });
});

test('renders fetched messages', async () => {
  axios.get.mockResolvedValue({ data: { messages: fakeMessages } });

  await act(async () => {
    render(<MessagesModal phone="+55" onClose={() => {}} />);
  });

  expect(await screen.findByText(/Hello Daniel/i)).toBeInTheDocument();
  expect(screen.getByText(/Tudo certo/i)).toBeInTheDocument();
});


test('calls onClose when clicking close button', async () => {
  axios.get.mockResolvedValue({ data: { messages: [] } });
  const onClose = jest.fn();
  render(<MessagesModal phone="+55" onClose={onClose} />);
  await waitFor(() => fireEvent.click(screen.getByText(/Close/i)));
  expect(onClose).toHaveBeenCalled();
});
