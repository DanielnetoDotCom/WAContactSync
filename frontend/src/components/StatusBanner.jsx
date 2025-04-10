export default function StatusBanner({ status }) {
  if (status === 'authenticating') {
    return (
      <div className="status-banner text-center text-blue-700 font-semibold mb-4">
        🔄 QR code scanned. Syncing contacts...
      </div>
    );
  }

  if (status === 'ready') {
    return (
      <div className="status-banner text-center text-green-700 font-semibold mb-4">
        ✅ WhatsApp is connected and ready!
      </div>
    );
  }

  return null;
}
