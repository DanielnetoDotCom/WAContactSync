import { QrCodeIcon, UserGroupIcon, TrashIcon } from '@heroicons/react/24/outline';


export default function ActionButtons({ onSync, onLoad, onReset, loading }) {
  return (
    <div className="flex gap-4 justify-center mb-6">
      <button
        onClick={onSync}
        disabled={loading}
        className="sync-button flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        <QrCodeIcon className="w-5 h-5" />
        Sync WhatsApp
      </button>

      <button
        onClick={onLoad}
        disabled={loading}
        className="load-button flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        <UserGroupIcon className="w-5 h-5" />
        Load Contacts
      </button>

      <button
        onClick={onReset}
        disabled={loading}
        className="reset-button flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        <TrashIcon className="w-5 h-5" />
        Reset All
      </button>
    </div>
  );
}
