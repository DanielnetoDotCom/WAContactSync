import axios from '../services/api';
import { useState } from 'react';

export function useWhatsAppActions(setContacts, setStatus) {
  const [loading, setLoading] = useState(false);

  const fetchContacts = async (params) => {
    const query = params.length ? `?${params.join('&')}` : '';
    try {
      const { data } = await axios.get(`/contacts${query}`);
      setContacts(data.contacts);
    } catch (err) {
      console.error('Auto reload contacts failed:', err.message);
    }
  };

  const syncWhatsApp = async (params) => {
    const query = params.length ? `?${params.join('&')}` : '';
    setLoading(true);
    setStatus('initial');
    try {
      await axios.post(`/whatsapp/restart${query}`);
      await fetchContacts(params);
    } catch (err) {
      console.error('Sync WhatsApp failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadContacts = async (params) => {
    await fetchContacts(params);
  };

  const syncMoreMessages = async (params) => {
    const query = params.length ? `?${params.join('&')}` : '';
    setLoading(true);
    try {
      await axios.post(`/contacts/sync${query}`, null, { timeout: 0 });
      await fetchContacts(params);
    } catch (err) {
      console.error('Sync more messages failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetContacts = async () => {
    setLoading(true);
    try {
      await axios.delete('/contacts/reset');
      setContacts([]);
    } catch (err) {
      console.error('Reset contacts failed:', err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    syncWhatsApp,
    loadContacts,
    resetContacts,
    syncMoreMessages,
    loading,
  };
}

