import { useState } from 'react';
import { PhoneIcon, ChatBubbleLeftEllipsisIcon } from '@heroicons/react/24/solid';

export default function ContactTable({ contacts, loading }) {
  const [sortBy, setSortBy] = useState('last_message_date');
  const [sortAsc, setSortAsc] = useState(false);

  if (loading) return <p>Loading...</p>;
  if (contacts.length === 0) return <p>No contacts found.</p>;

  const sortedContacts = [...contacts].sort((a, b) => {
    const aVal = a[sortBy];
    const bVal = b[sortBy];
  
    if (sortBy === 'message_count') {
      return sortAsc ? (aVal - bVal) : (bVal - aVal);
    }
  
    if (sortBy === 'last_message_date') {
      const aDate = new Date(aVal || 0).getTime();
      const bDate = new Date(bVal || 0).getTime();
      return sortAsc ? (aDate - bDate) : (bDate - aDate);
    }
  
    // Default: string comparison
    return sortAsc
      ? String(aVal || '').localeCompare(String(bVal || ''))
      : String(bVal || '').localeCompare(String(aVal || ''));
  });
  
  const handleSort = (column) => {
    setSortBy(column);
    setSortAsc(sortBy === column ? !sortAsc : true);
  };

  return (
    <div className="mt-6 overflow-x-auto">
      <h2 className="text-lg font-semibold mb-3">Contacts</h2>
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
          </tr>
        </thead>
        <tbody>
          {sortedContacts.map((contact, index) => (
            <tr key={index} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{contact.name}</td>
              <td className="px-4 py-2">{contact.phone}</td>
              <td className="px-4 py-2 text-center">{contact.message_count ?? 0}</td>
              <td className="px-4 py-2">{contact.last_message_date ? new Date(contact.last_message_date).toLocaleString() : '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
