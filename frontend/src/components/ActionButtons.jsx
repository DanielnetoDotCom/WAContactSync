import { QrCodeIcon, UserGroupIcon, TrashIcon, ArrowPathIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import Swal from 'sweetalert2';
import React from 'react';


export default function ActionButtons({ onSync, onLoad, onReset, onSyncMore, loading }) {
  const [onlyKnown, setOnlyKnown] = useState(true);
  const [onlyNotArchived, setOnlyNotArchived] = useState(true);
  const [messageLimit, setMessageLimit] = useState(100);

  const getParams = () => {
    const params = [];
    if (onlyKnown) params.push('onlyKnown=true');
    if (onlyNotArchived) params.push('onlyNotArchived=true');
    if (messageLimit) params.push(`limit=${messageLimit}`);
    return params;
  };

  const confirmReset = async () => {
    const result = await Swal.fire({
      icon: 'warning',
      title: 'Are you sure you want to reset everything?',
      html: `
        <p>This will:</p>
        <ul class="text-left list-disc list-inside">
          <li>Delete all synced contacts</li>
          <li>Delete all saved messages</li>
          <li>Reset WhatsApp session and QR code</li>
        </ul>
        <strong class="text-red-600">This action is irreversible.</strong>
      `,
      showCancelButton: true,
      confirmButtonText: 'Yes, reset everything',
      cancelButtonColor: '#dc2626',
    });

    if (result.isConfirmed) {
      onReset();
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 mb-6">
      <div className="flex gap-6 items-center text-sm">
        <label className="only-known-checkbox flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyKnown}
            onChange={() => setOnlyKnown(!onlyKnown)}
          />
          Only known contacts
        </label>

        <label className="exclude-archived-checkbox flex items-center gap-2">
          <input
            type="checkbox"
            checked={onlyNotArchived}
            onChange={() => setOnlyNotArchived(!onlyNotArchived)}
          />
          Exclude archived
        </label>

        <label className="flex items-center gap-2 text-sm">
          Message limit:
          <select
            className="border rounded p-1 text-sm"
            value={messageLimit}
            onChange={(e) => setMessageLimit(Number(e.target.value))}
          >
            {[20, 50, 100, 200, 500].map((n) => (
              <option key={n} value={n}>
                {n} msgs/contact
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex gap-4 justify-center flex-wrap">
        <button
          onClick={() => onSync(getParams())}
          disabled={loading}
          className="sync-button flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          <QrCodeIcon className="w-5 h-5" />
          Sync WhatsApp
        </button>

        <button
          onClick={() => onLoad(getParams())}
          disabled={loading}
          className="load-button flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          <UserGroupIcon className="w-5 h-5" />
          Load Contacts
        </button>

        <button
          onClick={() => onSyncMore(getParams())}
          disabled={loading}
          className="more-button flex items-center gap-2 bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          <ArrowPathIcon className="w-5 h-5" />
          Sync Again
        </button>

        <button
          onClick={confirmReset}
          disabled={loading}
          className="reset-button flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded text-sm disabled:opacity-50"
        >
          <TrashIcon className="w-5 h-5" />
          Reset All
        </button>
      </div>
    </div>
  );
}
