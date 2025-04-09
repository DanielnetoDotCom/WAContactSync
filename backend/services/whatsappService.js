import fs from 'fs';
import path, { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode';
import { broadcastEvent } from '../routes/whatsappEvents.js';

const { Client, LocalAuth } = pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const sessionDir = resolve(__dirname, '../.wwebjs_auth');

// Ignore busy log file
const originalUnlinkSync = fs.unlinkSync;
fs.unlinkSync = function (targetPath) {
  if (targetPath.includes('chrome_debug.log')) {
    try { originalUnlinkSync(targetPath); } 
    catch (e) {
      if (e.code === 'EBUSY') {
        console.warn(`⚠️ Ignoring busy file: ${targetPath}`);
        return;
      }
      throw e;
    }
  } else {
    return originalUnlinkSync(targetPath);
  }
};

let clientInstance = null;
let latestQR = null;
let isClientReady = false;

function createClient() {
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { headless: true },,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });

  client.on('qr', async (qr) => {
    latestQR = await qrcode.toDataURL(qr);
    console.log('🔄 QR code generated');
    broadcastEvent('qr', { qr: latestQR });
  });
  
  client.on('ready', () => {
    isClientReady = true;
    console.log('✅ WhatsApp client is ready!');
    broadcastEvent('ready', {});
  });
  

  client.on('authenticated', () => {
    console.log('🔐 Authenticated with WhatsApp.');
  });

  client.on('auth_failure', (msg) => {
    isClientReady = false;
    console.error('❌ Authentication failed:', msg);
  });

  client.initialize();
  clientInstance = client;
}

async function reinitializeClient() {
  console.log('♻️ Reinitializing WhatsApp client...');
  isClientReady = false;
  latestQR = null;

  if (clientInstance) {
    try {
      await clientInstance.destroy(); // important!
      console.log('🛑 Previous client destroyed.');
    } catch (err) {
      console.warn('⚠️ Error destroying client:', err.message);
    }
  }

  try {
    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, { recursive: true, force: true });
      console.log('🗑️ .wwebjs_auth folder deleted');
    }
  } catch (err) {
    console.error('Failed to delete session folder:', err.message);
  }

  createClient();
}


function getInstance() {
  return clientInstance;
}

function getLatestQR() {
  return latestQR;
}

function getClientStatus() {
  return isClientReady;
}

function setClientReady(state) {
  isClientReady = state;
}

createClient(); // start on load

export {
  getInstance,
  getLatestQR,
  getClientStatus,
  setClientReady,
  reinitializeClient,
};
