export default function QRSection({ status, qrCode }) {
    if (status !== 'waiting-qr') return null;
  
    return (
      <div className="text-center">
        <p className="mb-2 font-medium text-gray-700">Scan this QR code with WhatsApp:</p>
        {qrCode ? (
          <img src={qrCode} alt="QR Code" className="mx-auto w-64 h-64 border" />
        ) : (
          <p>Generating QR code...</p>
        )}
      </div>
    );
  }
  