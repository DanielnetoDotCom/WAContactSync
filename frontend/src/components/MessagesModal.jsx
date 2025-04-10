import React from 'react';
import { useEffect, useState } from 'react';
import axios from '../services/api';

// Modal to show messages from a specific contact
export default function MessagesModal({ phone, onClose }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch the last 100 messages from the given phone number
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/messages/${phone}`);
        setMessages(res.data.messages || []);
      } catch (err) {
        console.error('Failed to fetch messages:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [phone]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-lg font-semibold mb-4">Messages from {phone}</h2>

        {loading ? (
          <div className="text-gray-500 text-sm">Loading messages...</div>
        ) : (
          <>
            {messages.length === 0 ? (
              <p className="text-gray-500 text-sm">No messages found for this contact.</p>
            ) : (
              <ul className="space-y-3">
                {messages.map((msg) => (
                  <li
                    key={msg.id}
                    className="border-b pb-2 text-sm text-gray-800"
                  >
                    <span className="block text-gray-400 text-xs mb-1">
                      {new Date(msg.timestamp).toLocaleString()}
                    </span>
                    {msg.body || <em className="text-gray-400">(empty)</em>}
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        <div className="mt-6 text-right">
          <button
            onClick={onClose}
            className="bg-gray-700 hover:bg-gray-800 text-white px-4 py-2 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
