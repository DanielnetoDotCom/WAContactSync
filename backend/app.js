// backend/app.js
import express from 'express';
import cors from 'cors';
import contactsRoutes from './routes/contacts.js';
import whatsappRoutes from './routes/whatsapp.js';
import whatsappEventRoutes from './routes/whatsappEvents.js';
import messagesRoutes from './routes/messages.js';

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Register API routes
app.use('/api/contacts', contactsRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/whatsapp', whatsappEventRoutes);
app.use('/api/messages', messagesRoutes);

export default app;
