import express from 'express';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: './.env' });

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

app.get('/api/hello', (req, res) => {
  res.json({ message: 'Hello from backend!' });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
