import express from 'express';
import {
  listContacts,
  syncContacts,
  resetContacts,
} from '../controllers/contactsController.js';

const router = express.Router();

// GET /api/contacts
router.get('/', listContacts);

// POST /api/contacts/sync
router.post('/sync', syncContacts);

// DELETE /api/contacts/reset
router.delete('/reset', resetContacts);

export default router;
