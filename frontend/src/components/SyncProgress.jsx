export default function SyncProgress({ progress }) {
    if (!progress) return null;
  
    const percent = Math.floor((progress.current / progress.total) * 100);
  
    return (
      <div className="w-full bg-gray-200 rounded-lg p-2 mb-4">
        <div className="text-sm text-gray-700 mb-1">
          Syncing {progress.name} ({progress.phone})... {progress.current}/{progress.total}
        </div>
        <div className="w-full bg-gray-300 h-3 rounded overflow-hidden">
          <div className="bg-blue-600 h-3" style={{ width: `${percent}%` }}></div>
        </div>
      </div>
    );
  }