# 📱 WhatsApp Contact Sync

A full-stack application that connects to your WhatsApp Web session, syncs your contacts, and displays message statistics in a fast, modern, and user-friendly interface.

Created by **Daniel Neto** to demonstrate a professional-grade solution with modern tech, code organization, and great user experience.

---

## ✨ Features

- 🔄 Sync WhatsApp via QR code
- 👥 Contact list with:
  - Name and phone number
  - Total messages exchanged
  - Last message date
  - New messages since last sync
- 📸 Live QR code updates via SSE (no refresh needed)
- 🧭 Guided onboarding with React Joyride
- 🔁 "Reset All" button to clear everything and restart
- 🔎 Sorting by name, phone, message count or last message
- 🔐 Optional HTTPS support via Let’s Encrypt

---

## 🧑‍💻 Technologies

| Layer       | Stack                              |
|-------------|-------------------------------------|
| Frontend    | React (Vite), Tailwind CSS, Heroicons, Joyride |
| Backend     | Node.js, Express, SQLite, SSE       |
| WhatsApp API| [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) |

---

## 🔒 Privacy & Security

- All processing happens **locally** on your server
- No external services are used for contact or message data
- Session data can be reset at any time

---

## 📊 Message Count Explanation

- The app fetches **up to 100 recent messages** per contact.
- It counts messages stored in the WhatsApp Web session.
- This number may **differ from what you see on your phone** because WhatsApp doesn't expose the full history via this API.
- The **"new messages since last sync"** metric compares the last message timestamp with the time of the last sync.

---

## 🧰 Requirements

- Node.js 18 or later
- A modern web browser
- (Optional) Domain and SSL certificates for HTTPS

---

## 🚀 Installation

### 1. Clone the repository

```bash
git clone https://github.com/yourusername/WAContactSync.git
cd WAContactSync
```

### 2. Backend setup

```bash
cd backend
cp .env.example .env   # edit paths to your SSL certs if needed
npm install
node init-db.js        # creates SQLite database
npm start              # launches server (uses HTTPS if enabled)
```

> ✅ If `SSL_KEY_PATH` and `SSL_CERT_PATH` are set in `.env`, the backend will run over HTTPS automatically.

### 3. Frontend setup

```bash
cd frontend
cp .env.example .env   # set VITE_API_BASE_URL=http://localhost:4000
npm install
npm run dev
```

---

## 📋 How to Use

### 1. Open the app

Visit: [http://localhost:5173](http://localhost:5173)

### 2. Sync WhatsApp

- Click **"Sync WhatsApp"**
- Scan the QR code with your WhatsApp mobile app

### 3. Load Contacts

- Click **"Load Contacts"**
- View all synced contacts and message data

### 4. Reset all data (optional)

- Click **"Reset All"**
- This deletes contacts and authentication, prompting a fresh sync

### 5. Guided Tour

- Click **"❓ Help / Tour"** to get a walkthrough of the app

---

## 🔄 Sync & Real-Time Updates

- WhatsApp session is maintained via `whatsapp-web.js`
- QR code and status events are delivered through **Server-Sent Events (SSE)**
- The frontend updates automatically in real-time

---

## 🔐 HTTPS Support (Optional)

To enable HTTPS:

1. Obtain a valid SSL certificate (e.g. via Let’s Encrypt)
2. Set paths in `backend/.env`:

```env
SSL_KEY_PATH=/etc/letsencrypt/live/yourdomain.com/privkey.pem
SSL_CERT_PATH=/etc/letsencrypt/live/yourdomain.com/fullchain.pem
```

> ⚠️ Ensure the Node.js process has read access to the certificate files

---

## 🧠 Smart Handling

- If a QR code is requested while WhatsApp is already connected, the app prompts to reset
- If the connection times out while loading contacts, the app gracefully loads partial results
- Errors are handled with non-blocking toasts and fallback flows

---

## 💡 Planned Improvements

- Pagination or infinite scroll for large contact lists
- Export contacts and stats to Excel/CSV
- Dark mode support
- Mobile-responsive layout

---

## 🧑‍🎓 About the Developer

**Daniel Neto**  
🇧🇷 Brazilian Full-Stack Developer  
📜 PHP Zend Certified • MCP 70-480  
🔗 [linkedin.com/in/danielsantosneto](https://www.linkedin.com/in/danielsantosneto/)

---

> This project was built with attention to detail, scalability, and usability — demonstrating my ability to ship production-grade full-stack solutions. Enjoy!
