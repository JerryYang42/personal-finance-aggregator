import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import { Trading212Provider } from './providers/Trading212Provider.js';
import { validateEnv } from './config/validateEnv.js';

dotenv.config();

// Validate environment variables (skip in test mode)
if (process.env.NODE_ENV !== 'test') {
  validateEnv();
}

const app = express();
const port = process.env.PORT || 3000;
const nodeEnv = process.env.NODE_ENV || 'development';
const isTesting = nodeEnv === 'test';
const isProduction = nodeEnv === 'production';
// Logging verbosity
const logLevel = isProduction ? 'error' : 'debug';

// Injection: In production, we use real credentials
const t212StocksISA = new Trading212Provider(
  { 
    apiKey: process.env.TRADING212_STOCKS_ISA_API_KEY || '', 
    apiSecret: process.env.TRADING212_STOCKS_ISA_SECRET_KEY || '' 
  }
);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/balance', async (req, res) => {
  try {
    const balance = await t212StocksISA.getBalance();
    res.json({ source: 'Trading212 Stocks ISA', ...balance });
  } catch (error) {
    // In development, show detailed errors
    const errorMessage = logLevel === 'debug' && error instanceof Error 
      ? error.message 
      : 'Failed to fetch balance';
    res.status(500).json({ error: errorMessage });
  }
});

// Only start server if not in test environment and not being imported
if (!isTesting && process.argv[1] === fileURLToPath(import.meta.url)) {
  const server = app.listen(port, () => {
    console.log(`Server running in ${nodeEnv} mode at http://localhost:${port}`);
  });

  if (isProduction) {
    // In production, handle shutdown signals to close server gracefully
    const shutdown = (signal: string) => {
      console.log(`${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('Process terminated.');
        process.exit(0);
      });

      // Force shutdown after 10s if connections aren't closing
      setTimeout(() => {
        console.error('Forcing shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));
  } else {
    // In development, allow `tsx watch` to handle restarts
    process.on('SIGTERM', () => {
      console.log('SIGTERM received. Closing server...');
      server.close();
    });
    process.on('SIGINT', () => {
      console.log('SIGINT received. Closing server...');
      server.close();
    });
  }
}

export { app }; // Export for Integration Tests
