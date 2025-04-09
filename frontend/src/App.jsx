import { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

import Header        from './components/Header';
import QRSection     from './components/QRSection';
import ActionButtons from './components/ActionButtons';
import StatusBanner  from './components/StatusBanner';
import ContactTable  from './components/ContactTable';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

function App() {
  /* ------------- state ------------- */
  const [qrCode,   setQrCode]   = useState(null);
  const [contacts, setContacts] = useState([]);
  const [status,   setStatus]   = useState('initial'); // initial | waiting-qr | ready
  const [loading,  setLoading]  = useState(false);

  /* refs to keep interval IDs */
  const qrPollRef   = useRef(null); // polling while QR not ready
  const readyPollRef= useRef(null); // polling until client is authenticated

  /* ------------- actions ------------- */
  /** Called when the user clicks “Sync WhatsApp” */
  const syncWhatsApp = async () => {
    setLoading(true);
    setStatus('waiting-qr');

    await fetchQrOnce();

    /* start polling for QR if it wasn’t ready */
    if (!qrPollRef.current) {
      qrPollRef.current = setInterval(fetchQrOnce, 2000);
    }

    setLoading(false);
  };

  /** Single attempt to obtain the QR image */
  const fetchQrOnce = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/whatsapp/qr`, {
        validateStatus: () => true, // accept 204 without throwing
      });

      if (res.status === 200 && res.data.qr) {
        /* QR is finally available */
        setQrCode(res.data.qr);
        clearInterval(qrPollRef.current);
        qrPollRef.current = null;

        /* now poll for “ready” status */
        if (!readyPollRef.current) {
          readyPollRef.current = setInterval(checkClientStatus, 2000);
        }

        Swal.fire({
          icon: 'info',
          title: 'Scan the QR code',
          text: 'Open WhatsApp on your phone and scan the code.',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 4000,
        });
      }
    } catch (err) {
      console.error('QR fetch failed:', err.message);
    }
  };

  /** Poll backend until WhatsApp reports “ready” */
  const checkClientStatus = async () => {
    try {
      const { data } = await axios.get(`${API_BASE_URL}/api/whatsapp/status`);

      if (data.ready) {
        setStatus('ready');
        setQrCode(null);

        clearInterval(readyPollRef.current);
        readyPollRef.current = null;

        Swal.fire({
          icon: 'success',
          title: 'WhatsApp connected',
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
        });
      }
    } catch (err) {
      console.warn('Status check failed:', err.message);
    }
  };

  /** Load contacts from the API */
  const loadContacts = async () => {
    try {
      setLoading(true);

      const { data: s } = await axios.get(`${API_BASE_URL}/api/whatsapp/status`);
      if (!s.ready) {
        Swal.fire({
          icon: 'warning',
          title: 'WhatsApp is not connected',
          text: 'Please sync WhatsApp first.',
        });
        return;
      }

      const { data } = await axios.get(`${API_BASE_URL}/api/contacts`);
      setContacts(data.contacts);

      Swal.fire({
        icon: 'success',
        title: 'Contacts loaded',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (err) {
      console.error('Failed to load contacts', err);
      Swal.fire({
        icon: 'error',
        title: 'Error loading contacts',
        text: err.response?.data?.error || err.message,
      });
    } finally {
      setLoading(false);
    }
  };

  /** Delete DB + WhatsApp session */
  const resetContacts = async () => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This will delete all contacts and log out of WhatsApp.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, reset everything!',
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete(`${API_BASE_URL}/api/contacts/reset`);
      setContacts([]);
      setStatus('initial');

      Swal.fire({
        icon: 'success',
        title: 'Reset completed',
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (err) {
      console.error('Reset failed', err);
      Swal.fire({
        icon: 'error',
        title: 'Failed to reset',
      });
    } finally {
      setLoading(false);
    }
  };

  /* Cleanup any running intervals when the component unmounts */
  useEffect(() => {
    return () => {
      if (qrPollRef.current)   clearInterval(qrPollRef.current);
      if (readyPollRef.current)clearInterval(readyPollRef.current);
    };
  }, []);

  /* ------------- UI ------------- */
  return (
    <div className="p-4 w-full mx-auto">
      <Header />

      <ActionButtons
        onSync={syncWhatsApp}
        onLoad={loadContacts}
        onReset={resetContacts}
        loading={loading}
      />

      <QRSection status={status} qrCode={qrCode} />
      <StatusBanner status={status} />
      <ContactTable contacts={contacts} loading={loading} />
    </div>
  );
}

export default App;
