export default function SyncProgress({ progress }) {
  const entries = Object.values(progress);
  if (entries.length === 0) return null;

  // Get the most recent contact in progress (last updated)
  const latest = entries[entries.length - 1];
  const percent = Math.floor((latest.current / latest.total) * 100);

  return (
    <div className="w-full bg-gray-200 rounded-lg p-4 mb-6 shadow-sm">
      <div className="text-sm text-gray-700 mb-2">
        Syncing <strong>{latest.name}</strong> ({latest.phone})<br />
        Message {latest.current}/{latest.total}
      </div>
      <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
        <div className="bg-blue-600 h-3 transition-all duration-200" style={{ width: `${percent}%` }} />
      </div>
    </div>
  );
}
