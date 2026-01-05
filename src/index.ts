import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import { AccountService } from './services/AccountService.js';
import { validateEnv } from './config/validateEnv.js';
import { PROVIDER_CONFIGS } from './config/providers.js';

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

// Initialize account service
const accountService = new AccountService();

// Register providers
PROVIDER_CONFIGS.forEach(config => {
  accountService.registerProvider(config.id, config.provider, config.accountType);
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

app.get('/accounts', (req, res) => {
  try {
    const accounts = accountService.listAccounts();
    res.json({ accounts });
  } catch (error) {
    const errorMessage = logLevel === 'debug' && error instanceof Error 
      ? error.message 
      : 'Failed to list accounts';
    res.status(500).json({ error: errorMessage });
  }
});

app.get('/accounts/:accountId/balance', async (req, res) => {
  try {
    const balance = await accountService.getBalance(req.params.accountId);
    res.json(balance);
  } catch (error) {
    const errorMessage = logLevel === 'debug' && error instanceof Error 
      ? error.message 
      : 'Failed to fetch balance';
    const statusCode = error instanceof Error && error.message.includes('not found') ? 404 : 500;
    res.status(statusCode).json({ error: errorMessage });
  }
});

app.get('/balances', async (req, res) => {
  try {
    const balances = await accountService.getAllBalances();
    res.json({ balances });
  } catch (error) {
    const errorMessage = logLevel === 'debug' && error instanceof Error 
      ? error.message 
      : 'Failed to fetch balances';
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
