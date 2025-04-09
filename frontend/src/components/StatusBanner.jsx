export default function StatusBanner({ status }) {
  if (status !== 'ready') return null;

  return (
    <div className="text-center text-green-700 font-semibold mb-4">
      ✅ WhatsApp is connected and ready!
    </div>
  );
}
