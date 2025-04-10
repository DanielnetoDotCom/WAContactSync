import { useState, useEffect } from 'react';
import Joyride from 'react-joyride';

import { useWhatsAppActions } from './hooks/useWhatsAppActions';
import { useTourSteps } from './tour/useTourSteps';

import Header from './components/Header';
import ActionButtons from './components/ActionButtons';
import QRSection from './components/QRSection';
import StatusBanner from './components/StatusBanner';
import ContactTable from './components/ContactTable';
import SyncProgress from './components/SyncProgress';

function App() {
  const [contacts, setContacts] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState('initial');
  const [progress, setProgress] = useState(null); // New: sync progress state

  const { syncWhatsApp, loadContacts, resetContacts, loading } =
    useWhatsAppActions(setContacts, setQrCode, setStatus);
  const { steps, runTour, setRunTour } = useTourSteps();

  useEffect(() => {
    const source = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/api/whatsapp/events`);

    source.addEventListener('qr', (e) => {
      const { qr } = JSON.parse(e.data);
      setQrCode(qr);
      setStatus('waiting-qr');
    });

    source.addEventListener('ready', () => {
      setQrCode(null);
      setStatus('ready');
    });

    // New: listen to sync progress event
    source.addEventListener('sync-progress', (e) => {
      const data = JSON.parse(e.data);
      setProgress(data);
    });

    return () => source.close();
  }, []);

  return (
    <div className="p-4 w-full mx-auto">
      <Joyride
        steps={steps}
        run={runTour}
        continuous
        showProgress
        showSkipButton
        styles={{ options: { zIndex: 9999 } }}
        callback={(data) => {
          if (['finished', 'skipped'].includes(data.status)) setRunTour(false);
        }}
      />

      <div className="flex justify-between items-center mb-4">
        <Header />
        <button onClick={() => setRunTour(true)} className="text-sm bg-gray-200 px-3 py-1 rounded">
          ❓ Help / Tour
        </button>
      </div>

      <ActionButtons
        onSync={syncWhatsApp}
        onLoad={loadContacts}
        onReset={resetContacts}
        loading={loading}
      />

      <QRSection status={status} qrCode={qrCode} />
      <StatusBanner status={status} />

      {/* New: show sync progress */}
      {progress && <SyncProgress progress={progress} />}

      <ContactTable contacts={contacts} setContacts={setContacts} loading={loading} />
    </div>
  );
}

export default App;
