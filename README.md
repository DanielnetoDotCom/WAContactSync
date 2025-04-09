- **Project Description:**  
  This project is about synchronizing WhatsApp contacts and interaction metadata into an SQL database. The goal is to provide a clean and sortable interface to visualize a network of contacts. The application operates on a per-session basis and uses QR Code authentication with WhatsApp Web.

- **Features:**  
  - Synchronizes WhatsApp contacts and interaction metadata.  
  - Displays a QR Code for WhatsApp Web authentication.  
  - Temporarily stores data in an SQLite database.  
  - Provides a user interface to view contacts sorted by the date of the last interaction.

- **Project Architecture:**  
  - **Frontend:**  
    - Framework: React (initialized with Vite).  
    - Styling: Tailwind CSS.  
    - Features include displaying the QR Code, a synchronization button, and a contacts table.  
    - Communicates with the backend via Axios.
  - **Backend:**  
    - Runtime: Node.js.  
    - Framework: Express.js.  
    - Exposes REST APIs for contact synchronization and retrieval.  
    - Integrates with WhatsApp using whatsapp-web.js.
  - **WhatsApp Integration:**  
    - Main Library: whatsapp-web.js.  
    - Fallback Option: Puppeteer, if necessary.
  - **Database:**  
    - Engine: SQLite.  
    - Mode: Persistent storage (with the option to switch to in-memory mode for a fully ephemeral experience).

- **User Flow:**  
  - When the application starts, a new session is initiated.  
  - The user clicks the "Sync WhatsApp" button.  
  - A QR Code is displayed for WhatsApp Web login.  
  - After successful authentication, the app extracts contact data (name, phone number, date of last interaction, and an approximate message count) and saves it into the database.  
  - The interface updates automatically to display the sorted contacts table.

- **Execution Plan and Time Estimates:**  
  - Environment Setup (React with Vite, Tailwind CSS, Express.js, SQLite): **0.5 day**.  
  - WhatsApp Integration (setting up whatsapp-web.js for authentication and data extraction): **2 days**.  
  - Data Insertion Logic: **1 day**.  
  - API Development: **1 day**.  
  - Frontend Implementation (synchronization button and table view): **1 day**.  
  - Testing and Refinement (including error handling and loading states): **1.5 days**.  
  - **Total Estimated Time:** **7 days**.

- **Risks and Considerations:**  
  - The session token from whatsapp-web.js may expire, requiring re-authentication via QR Code.  
  - The message count might be limited or not fully accurate.  
  - Data is maintained on a per-session basis, with no persistence across sessions, as specified by design.

- **Project Dependencies:**  
  - **Backend:**  
    - express  
    - whatsapp-web.js  
    - sqlite3  
  - **Frontend:**  
    - react (via Vite)  
    - tailwindcss  
    - axios

- **Installation Instructions:**  
  1. Clone the repository.  
  2. In the project directory, install the backend dependencies using `npm install` or `yarn install` in the appropriate folder.  
  3. Configure the SQLite database by setting up the schema as needed (the `contacts.db` file will be created automatically in persistent mode).  
  4. Install the frontend dependencies and start the project with `npm run dev` or `yarn dev`.

- **Usage Instructions:**  
  1. Start both the backend server and the frontend application.  
  2. Access the application via a web browser.  
  3. Click the "Sync WhatsApp" button to initiate the QR Code authentication flow.  
  4. Upon successful authentication, the application will fetch and display an updated contacts table.

- **License:**  
  The project is licensed under the MIT License, permitting broad use and modification under its terms.
