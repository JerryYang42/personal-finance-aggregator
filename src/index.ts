import express from 'express';
import dotenv from 'dotenv';
import { Trading212Provider } from './providers/Trading212Provider.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Injection: In production, we use real credentials
const t212 = new Trading212Provider(
  process.env.TRADING212_API_KEY || '',
  process.env.TRADING212_SECRET_KEY || ''
);

app.get('/balance', async (req, res) => {
  try {
    const balance = await t212.getBalance();
    res.json({ source: 'Trading 212', ...balance });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch balance' });
  }
});

const server = app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// --- Graceful Shutdown Logic ---
const shutdown = () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated.');
    process.exit(0);
  });

  // Force shutdown after 10s if connections aren't closing
  setTimeout(() => process.exit(1), 10000);
};

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

export { app }; // Export for Integration Tests