import fs from 'fs';
import path, { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import pkg from 'whatsapp-web.js';
import qrcode from 'qrcode';
import { broadcastEvent } from '../routes/whatsappEvents.js';

const { Client, LocalAuth } = pkg;
const __dirname = dirname(fileURLToPath(import.meta.url));
const sessionDir = resolve(__dirname, '../.wwebjs_auth');

// Patch fs.unlinkSync to avoid EBUSY log file
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

/**
 * Creates and initializes a new WhatsApp client
 */
function createClient() {
  const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: {
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    },
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

/**
 * Safely destroys and reinitializes the WhatsApp client
 */
export async function reinitializeClient() {
  console.log('♻️ Reinitializing WhatsApp client...');
  isClientReady = false;
  latestQR = null;

  if (clientInstance) {
    try {
      // Attempt to close browser cleanly
      if (clientInstance.pupBrowser && typeof clientInstance.pupBrowser === 'function') {
        const browser = await clientInstance.pupBrowser();
        if (browser) {
          await browser.close();
          console.log('🧹 Browser closed safely');
        }
      }

      await clientInstance.destroy();
      console.log('🛑 WhatsApp client destroyed');
    } catch (err) {
      console.warn('⚠️ Failed to destroy client cleanly:', err.message);
    }
  }

  try {
    if (fs.existsSync(sessionDir)) {
      fs.rmSync(sessionDir, { recursive: true, force: true });
      console.log('🗑️ .wwebjs_auth folder deleted');
    }
  } catch (err) {
    console.error('❌ Error deleting session folder:', err.message);
  }

  // Small delay to avoid race conditions in Puppeteer
  setTimeout(() => {
    createClient();
  }, 2000);
}

/**
 * Returns the active client instance
 */
export function getInstance() {
  return clientInstance;
}

/**
 * Returns the latest QR code
 */
export function getLatestQR() {
  return latestQR;
}

/**
 * Returns true if WhatsApp is ready
 */
export function getClientStatus() {
  return isClientReady;
}

/**
 * Allows setting the client status
 */
export function setClientReady(state) {
  isClientReady = state;
}

// Create client when service starts
createClient();
