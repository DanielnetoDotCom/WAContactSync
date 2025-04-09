import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import contactsRoutes from './routes/contacts.js';
import whatsappRoutes from './routes/whatsapp.js';
import whatsappEventRoutes from './routes/whatsappEvents.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Route namespaces
app.use('/api/contacts', contactsRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/whatsapp', whatsappEventRoutes);

const PORT = process.env.BACKEND_PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
