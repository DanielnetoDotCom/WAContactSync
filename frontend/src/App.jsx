import { useState, useEffect } from 'react';
import Joyride from 'react-joyride';
import Swal from 'sweetalert2';

import { useWhatsAppActions } from './hooks/useWhatsAppActions';
import { useTourSteps } from './tour/useTourSteps';

import Header from './components/Header';
import ActionButtons from './components/ActionButtons';
import QRSection from './components/QRSection';
import StatusBanner from './components/StatusBanner';
import ContactTable from './components/ContactTable';
import SyncProgress from './components/SyncProgress';
import axios from './services/api';

function App() {
  const [contacts, setContacts] = useState([]);
  const [qrCode, setQrCode] = useState(null);
  const [status, setStatus] = useState('initial');
  const [progress, setProgress] = useState({});

  const {
    syncWhatsApp,
    loadContacts,
    resetContacts,
    syncMoreMessages,
    loading,
  } = useWhatsAppActions(setContacts, setQrCode, setStatus, setProgress);

  const { steps, runTour, setRunTour } = useTourSteps();

  useEffect(() => {
    const source = new EventSource(`${import.meta.env.VITE_API_BASE_URL}/api/whatsapp/events`);

    source.addEventListener('qr', (e) => {
      const { qr } = JSON.parse(e.data);
      setQrCode(qr);
      setStatus('waiting-qr');
    });

    source.addEventListener('ready', async () => {
      setQrCode(null);
      const params = ['onlyKnown=true', 'onlyNotArchived=true'];

      try {
        const { data } = await axios.get(`/contacts?${params.join('&')}`);
        if (!data.contacts || data.contacts.length === 0) {
          setStatus('authenticating'); // show "syncing..." banner
          await axios.post(`/contacts/sync?${params.join('&')}`, null, { timeout: 0 });
          const refreshed = await axios.get(`/contacts?${params.join('&')}`);
          setContacts(refreshed.data.contacts);
        } else {
          setContacts(data.contacts);
        }
        setStatus('ready'); // ✅ move to ready only after loading contacts
      } catch (err) {
        console.error('Failed to load contacts after ready:', err.message);
        setStatus('ready'); // fallback to ready anyway
      }
    });



    source.addEventListener('sync-progress', (e) => {
      const data = JSON.parse(e.data);
      setProgress((prev) => ({ ...prev, [data.phone]: data }));
    });

    source.addEventListener('sync-complete', () => {
      setProgress({});
    });

    source.addEventListener('toast', (e) => {
      const data = JSON.parse(e.data);
      if (data?.message) {
        Swal.fire({
          toast: true,
          icon: data.type || 'info',
          title: data.message,
          timer: 3000,
          showConfirmButton: false,
          position: 'top-end',
        });
      }
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
        onSyncMore={syncMoreMessages}
        loading={loading}
      />

      <QRSection status={status} qrCode={qrCode} />
      <StatusBanner status={status} />
      <SyncProgress progress={progress} />
      <ContactTable contacts={contacts} setContacts={setContacts} loading={loading} />
    </div>
  );
}

export default App;
