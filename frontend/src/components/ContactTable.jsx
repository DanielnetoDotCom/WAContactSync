import { useState } from 'react';
import { PhoneIcon, ChatBubbleLeftEllipsisIcon, EyeIcon } from '@heroicons/react/24/solid';
import MessagesModal from './MessagesModal';

export default function ContactTable({ contacts, loading }) {
  const [sortBy, setSortBy] = useState('last_message_date');
  const [sortAsc, setSortAsc] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedPhone, setSelectedPhone] = useState(null);

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
    <div className="contacts-table mt-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-800">
          Contacts{' '}
          <span className="ml-2 inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
            {filteredContacts.length} shown
          </span>
        </h2>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-4 mb-4">
        <input
          type="text"
          placeholder="Search by name or phone..."
          className="p-2 border border-gray-300 rounded w-full max-w-md shadow-sm"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="overflow-x-auto rounded shadow border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('name')}
              >
                Name {sortBy === 'name' ? (sortAsc ? '▲' : '▼') : ''}
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('phone')}
              >
                <div className="flex items-center gap-1">
                  <PhoneIcon className="w-4 h-4 text-gray-600" /> Phone {sortBy === 'phone' ? (sortAsc ? '▲' : '▼') : ''}
                </div>
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('message_count')}
              >
                <div className="flex items-center gap-1">
                  <ChatBubbleLeftEllipsisIcon className="w-4 h-4 text-gray-600" /> Messages {sortBy === 'message_count' ? (sortAsc ? '▲' : '▼') : ''}
                </div>
              </th>
              <th
                className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort('last_message_date')}
              >
                Last Message {sortBy === 'last_message_date' ? (sortAsc ? '▲' : '▼') : ''}
              </th>
              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedContacts.map((contact, index) => (
              <tr key={index}>
                <td className="px-4 py-2 text-sm text-gray-500">{index + 1}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{contact.name}</td>
                <td className="px-4 py-2 text-sm text-gray-800">{contact.phone}</td>
                <td className="px-4 py-2 text-sm text-center">
                  {contact.message_count ?? 0}
                </td>
                <td className="px-4 py-2 text-sm text-gray-600">
                  {contact.last_message_date
                    ? new Date(contact.last_message_date).toLocaleString()
                    : '—'}
                </td>
                <td className="px-4 py-2">
                  <button
                    onClick={() => setSelectedPhone(contact.phone)}
                    className="text-sm text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <EyeIcon className="w-4 h-4" /> View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedPhone && (
        <MessagesModal phone={selectedPhone} onClose={() => setSelectedPhone(null)} />
      )}
    </div>
  );
}