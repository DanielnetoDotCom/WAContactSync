# 📱 WhatsApp Contact Sync

A simple and smart tool to connect with your WhatsApp Web, fetch your contact list and message metadata, and display everything in a beautiful and interactive web interface.

This project was developed by Daniel Neto as a full-stack demonstration using modern technologies like React, Node.js, and SQLite.

---

## ✨ What This App Can Do

- 🔄 Sync your WhatsApp account using a QR code
- 👥 Show a list of your contacts with:
  - Name and phone number
  - Total messages exchanged (up to 100 per contact)
  - Last message date
  - New messages since the last sync
- 🔍 Sort and explore the contact list
- 🧼 Reset everything at any time (including session and contacts)
- 📸 Automatically refreshes QR code and status via real-time events (no manual refresh needed!)
- 🧭 Step-by-step user tour built-in (with React Joyride)

---

## 🖼️ Preview

![chrome-capture-2025-4-9](https://github.com/user-attachments/assets/4d192def-7da8-4dc8-a8fa-da20e7da4980)

![chrome-capture-2025-4-9](https://github.com/user-attachments/assets/96b0aac9-5e69-4ddd-9950-95e2673333d3)

---

## 🧰 Tech Stack

| Layer      | Tech Used                  |
|------------|----------------------------|
| Frontend   | React (Vite), Tailwind CSS |
| Backend    | Node.js, Express.js        |
| WhatsApp   | [whatsapp-web.js](https://github.com/pedroslopez/whatsapp-web.js) |
| Database   | SQLite                     |

---

## 🧑‍💻 How to Install (Developer Setup)

### 📦 Requirements

- Node.js ≥ 18
- npm or yarn

---

### 🔧 Step-by-step Installation

#### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/whatsapp-contact-sync
cd whatsapp-contact-sync
```

#### 2. Backend setup
```bash
cd backend
npm install
node init-db.js        # Initializes the SQLite database
npm start              # Starts the backend on http://localhost:4000
```

#### 3. Frontend setup
```bash
cd frontend
npm install
npm run dev            # Starts frontend on http://localhost:5173
```

Make sure you have this in your `.env` file inside `frontend/`:
```
VITE_API_BASE_URL=http://localhost:4000
```

---

## 👨‍💼 How to Use

### 1. Open the web interface

Go to: [http://localhost:5173](http://localhost:5173)

### 2. Sync WhatsApp
- Click **"Sync WhatsApp"**
- A QR code will be displayed
- Scan it using WhatsApp from your mobile phone

### 3. Load Contacts
- Once connected, click **"Load Contacts"**
- The table will show your contacts with last message info

### 4. Reset All
- Click **"Reset All"** to:
  - Log out from WhatsApp
  - Clear the contact list
  - Prepare for a new session

### 5. Take a Quick Tour (Optional)
- Click **"❓ Help / Tour"** to learn how the interface works.

---

## 🔐 Privacy

- All your data stays **on your machine**
- Nothing is stored or shared externally
- You can delete all session data at any time

---

## 🔄 Sync Details

- Only the **latest 100 messages** per contact are used
- Sorting works by message count, name, phone, or last date
- "New messages since last sync" is shown based on the last loaded state

---

## 🚀 Improvements Considered

- Pagination for large contact lists
- Export to CSV
- Dark mode toggle
- Better mobile support

---

## 🛠️ Troubleshooting

- If QR code doesn’t show: try clicking “Reset All” and then “Sync WhatsApp” again
- If contacts don’t load: wait a few seconds or try refreshing the page
- Logs can be viewed in the terminal (both backend and frontend)

---

## 🧑‍🎓 About the Developer

**Daniel Neto**  
🇧🇷 Based in Brazil  
💻 Full Stack Web Developer  
📜 PHP Zend Certified | MCP 70-480  
🔗 [linkedin.com/in/danielneto](https://linkedin.com/in/danielneto)

---

> Thank you for checking out this project! I hope it’s useful and a good demonstration of clean architecture, real-time integrations, and practical UX.
