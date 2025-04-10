import { useState } from 'react';
import Swal from 'sweetalert2';
import axios from '../services/api';

export function useWhatsAppActions(setContacts, setQrCode, setStatus) {
  const [loading, setLoading] = useState(false);

  const syncWhatsApp = async () => {
    try {
      setLoading(true);

      const { data } = await axios.get('/whatsapp/status');

      if (data.ready) {
        const confirm = await Swal.fire({
          title: 'WhatsApp is already connected',
          text: 'Do you want to regenerate a new QR code (you’ll be logged out)?',
          icon: 'question',
          showCancelButton: true,
        });

        if (!confirm.isConfirmed) return;
      }

      // Reinicia sempre, mesmo se não estiver pronto
      await axios.post('/whatsapp/restart');
      setContacts([]);
      setQrCode(null);
      setStatus('waiting-qr');

      Swal.fire({
        icon: 'info',
        title: 'Waiting for QR code',
        toast: true,
        showConfirmButton: false,
        timer: 3000,
      });
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Sync failed' });
    } finally {
      setLoading(false);
    }
  };


  const loadContacts = async () => {
    const controller = new AbortController();
    let timeout;
    if (!document.hidden) {
      timeout = setTimeout(() => controller.abort(), 5000); // Only timeout if not syncing
    }


    try {
      setLoading(true);
      const { data: status } = await axios.get('/whatsapp/status', { signal: controller.signal });

      if (!status.ready) {
        Swal.fire({ icon: 'warning', title: 'WhatsApp not connected' });
        return;
      }

      const { data } = await axios.get('/contacts', { signal: controller.signal });

      setContacts(data.contacts);

      Swal.fire({
        icon: 'success',
        title: 'Contacts loaded',
        toast: true,
        timer: 2000,
      });
    } catch (err) {
      if (err.name === 'CanceledError') {
        // Still try to get partial data from cache, if available
        console.warn('⚠️ Timeout fetching contacts. Trying to reuse partial data.');
        try {
          const { data } = await axios.get('/contacts'); // Retry without timeout
          setContacts(data.contacts);

          Swal.fire({
            icon: 'warning',
            title: 'Timeout',
            text: 'Partial contacts loaded after timeout.',
            toast: true,
            timer: 3000,
          });
        } catch (innerErr) {
          Swal.fire({
            icon: 'error',
            title: 'Failed to load contacts',
            text: innerErr.message,
          });
        }
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Error loading contacts',
          text: err.message,
        });
      }
    } finally {
      clearTimeout(timeout);
      setLoading(false);
    }
  };



  const resetContacts = async () => {
    const confirm = await Swal.fire({
      title: 'Reset everything?',
      icon: 'warning',
      showCancelButton: true,
    });

    if (!confirm.isConfirmed) return;

    try {
      setLoading(true);
      await axios.delete('/contacts/reset');
      setContacts([]);
      setStatus('initial');
      Swal.fire({ icon: 'success', title: 'Reset complete', toast: true, timer: 2000 });
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Reset failed ' + err.message });
    } finally {
      setLoading(false);
    }
  };

  return { syncWhatsApp, loadContacts, resetContacts, loading };
}
