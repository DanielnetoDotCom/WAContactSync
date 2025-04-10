import { useState } from 'react';
import { PhoneIcon, ChatBubbleLeftEllipsisIcon, EyeIcon } from '@heroicons/react/24/solid';
import axios from '../services/api';
import Swal from 'sweetalert2';
import MessagesModal from './MessagesModal';

export default function ContactTable({ contacts, setContacts, loading }) {
  const [sortBy, setSortBy] = useState('last_message_date');
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState('');
  const [syncing, setSyncing] = useState(false);
  const [selectedPhone, setSelectedPhone] = useState(null); // Used for modal trigger

  const handleSyncMore = async () => {
    const confirm = await Swal.fire({
      icon: 'question',
      title: 'Sync more messages?',
      text: 'Do you want to resync all contacts and try fetching more messages?',
      showCancelButton: true,
      confirmButtonText: 'Yes, sync again',
    });

    if (!confirm.isConfirmed) return;

    try {
      setSyncing(true);
      await axios.post('/contacts/sync', null, { timeout: 0 });

      const { data } = await axios.get('/contacts');
      setContacts(data.contacts);

      Swal.fire({
        icon: 'success',
        title: 'Contacts re-synced',
        toast: true,
        timer: 2000,
        showConfirmButton: false,
      });
    } catch (err) {
      console.error('❌ Sync failed:', err.message);
      Swal.fire({
        icon: 'error',
        title: 'Sync failed',
        text: err.message,
      });
    } finally {
      setSyncing(false);
    }
  };

  if (loading) {
    return (
      <div className="contacts-table text-center py-10 text-gray-500 animate-pulse">
        <svg className="mx-auto h-10 w-10 animate-spin text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"></path>
        </svg>
        <p>Loading contacts…</p>
      </div>
    );
  }

  if (contacts.length === 0) return <p className="contacts-table">No contacts found.</p>;

  const filteredContacts = contacts.filter((c) =>
    c.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.phone?.toLowerCase().includes(search.toLowerCase())
  );

  const sortedContacts = [...filteredContacts].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];

    if (sortBy === 'message_count') return sortAsc ? aVal - bVal : bVal - aVal;

    if (sortBy === 'last_message_date') {
      const aDate = new Date(aVal || 0).getTime();
      const bDate = new Date(bVal || 0).getTime();
      return sortAsc ? aDate - bDate : bDate - aDate;
    }

    return sortAsc
      ? String(aVal || '').localeCompare(String(bVal || ''))
      : String(bVal || '').localeCompare(String(aVal || ''));
  });

  const handleSort = (column) => {
    setSortBy(column);
    setSortAsc(sortBy === column ? !sortAsc : true);
  };

  return (
    <div className="contacts-table mt-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-3">Contacts</h2>

      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <input
          type="text"
          placeholder="Search by name or phone..."
          className="p-2 border border-gray-300 rounded w-full max-w-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
          onClick={handleSyncMore}
          disabled={syncing}
        >
          🔄 Sync More Messages
        </button>
      </div>

      <table className="min-w-full border border-gray-300 rounded-md overflow-hidden shadow-sm">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            <th className="text-left px-4 py-2">#</th>
            <th className="text-left px-4 py-2 cursor-pointer" onClick={() => handleSort('name')}>
              Name {sortBy === 'name' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
            <th className="text-left px-4 py-2 cursor-pointer" onClick={() => handleSort('phone')}>
              <div className="flex items-center gap-1">
                <PhoneIcon className="w-4 h-4 text-gray-600" />
                Phone {sortBy === 'phone' ? (sortAsc ? '▲' : '▼') : ''}
              </div>
            </th>
            <th className="text-left px-4 py-2 cursor-pointer" onClick={() => handleSort('message_count')}>
              <div className="flex items-center gap-1">
                <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-gray-600" />
                Total Messages {sortBy === 'message_count' ? (sortAsc ? '▲' : '▼') : ''}
              </div>
            </th>
            <th className="text-left px-4 py-2 cursor-pointer" onClick={() => handleSort('last_message_date')}>
              Last Message {sortBy === 'last_message_date' ? (sortAsc ? '▲' : '▼') : ''}
            </th>
            <th className="text-left px-4 py-2">
              <div className="flex items-center gap-1">
                <EyeIcon className="w-4 h-4 text-gray-600" />
                View
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {sortedContacts.map((contact, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{contact.name}</td>
              <td className="px-4 py-2">{contact.phone}</td>
              <td className="px-4 py-2 text-center">
                {contact.message_count >= 100 ? '100+' : contact.message_count ?? 0}
              </td>
              <td className="px-4 py-2">
                {contact.last_message_date
                  ? new Date(contact.last_message_date).toLocaleString()
                  : '—'}
              </td>
              <td className="px-4 py-2">
                <button
                  onClick={() => setSelectedPhone(contact.phone)}
                  className="text-blue-600 hover:underline flex items-center gap-1 text-sm"
                >
                  <EyeIcon className="w-4 h-4" />
                  View
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPhone && (
        <MessagesModal phone={selectedPhone} onClose={() => setSelectedPhone(null)} />
      )}
    </div>
  );
}
