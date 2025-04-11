CREATE TABLE IF NOT EXISTS contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  phone TEXT,
  message_count INTEGER,
  last_message_date TEXT
);

CREATE TABLE IF NOT EXISTS messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  contact_id INTEGER,
  message TEXT,
  timestamp TEXT,
  FOREIGN KEY(contact_id) REFERENCES contacts(id)
);
