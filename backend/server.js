import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import fs from 'fs';
import https from 'https';
import http from 'http';

import contactsRoutes from './routes/contacts.js';
import whatsappRoutes from './routes/whatsapp.js';
import whatsappEventRoutes from './routes/whatsappEvents.js';

// Load environment variables
dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Register API routes
app.use('/api/contacts', contactsRoutes);
app.use('/api/whatsapp', whatsappRoutes);
app.use('/api/whatsapp', whatsappEventRoutes);

// Use port from env or fallback to 4000
const PORT = process.env.BACKEND_PORT || 4000;

// Load SSL paths from environment
const keyPath = process.env.SSL_KEY_PATH;
const certPath = process.env.SSL_CERT_PATH;

// Conditional HTTPS support
if (keyPath && certPath && fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  // SSL files found, start HTTPS server
  const sslOptions = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath),
  };

  https.createServer(sslOptions, app).listen(PORT, () => {
    console.log(`🔐 HTTPS server is running on port ${PORT}`);
  });
} else {
  // SSL not configured, start regular HTTP server
  http.createServer(app).listen(PORT, () => {
    console.log(`🌐 HTTP server is running on port ${PORT}`);
  });
}
