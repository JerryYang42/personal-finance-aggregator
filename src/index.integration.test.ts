import request from 'supertest';
import nock from 'nock';
import type { Express } from 'express';

describe('Integration Tests with External API Mocking', () => {
  let app: Express;

  beforeAll(async () => {
    // Dynamically import the app
    const indexModule = await import('./index.js');
    app = indexModule.app;
  });

  beforeEach(() => {
    // Clean all nock mocks before each test
    nock.cleanAll();
  });

  afterEach(() => {
    // Verify all nock interceptors were called
    if (!nock.isDone()) {
      console.error('Pending nock interceptors:', nock.pendingMocks());
    }
    nock.cleanAll();
  });

  afterAll(() => {
    // Restore normal HTTP behavior
    nock.restore();
  });

  describe('GET /accounts', () => {
    it('should return list of accounts', async () => {
      const response = await request(app)
        .get('/accounts')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        accounts: [
          {
            id: 'trading212-stocks-isa',
            name: 'Trading212 Stocks ISA',
            type: 'investment'
          },
          {
            id: 'trading212-investment-account',
            name: 'Trading212 Investment Account',
            type: 'investment'
          }
        ]
      });
    });
  });

  describe('GET /accounts/:accountId/balance', () => {
    it('should return balance from Trading212 API', async () => {
      // Mock the external Trading212 API endpoint
      nock('https://live.trading212.com')
        .get('/api/v0/equity/account/summary')
        .matchHeader('Authorization', /^Basic /)
        .reply(200, {
          totalValue: 1234.56
        });

      const response = await request(app)
        .get('/accounts/trading212-stocks-isa/balance')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        accountId: 'trading212-stocks-isa',
        accountName: 'Trading212 Stocks ISA',
        balance: 1234.56,
        currency: 'GBP'
      });
    });

    it('should return 404 for non-existent account', async () => {
      const response = await request(app)
        .get('/accounts/non-existent-account/balance')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('not found');
    });

    it('should handle API errors gracefully', async () => {
      // Mock a 500 error from Trading212 API
      nock('https://live.trading212.com')
        .get('/api/v0/equity/account/summary')
        .matchHeader('Authorization', /^Basic /)
        .reply(500, {
          message: 'Internal Server Error'
        });

      const response = await request(app)
        .get('/accounts/trading212-stocks-isa/balance')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle network errors', async () => {
      // Mock a network failure
      nock('https://live.trading212.com')
        .get('/api/v0/equity/account/summary')
        .replyWithError('Network connection failed');

      const response = await request(app)
        .get('/accounts/trading212-stocks-isa/balance')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle unauthorized errors', async () => {
      // Mock a 401 Unauthorized response
      nock('https://live.trading212.com')
        .get('/api/v0/equity/account/summary')
        .matchHeader('Authorization', /^Basic /)
        .reply(401, {
          message: 'Invalid API credentials'
        });

      const response = await request(app)
        .get('/accounts/trading212-stocks-isa/balance')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('should send correct Basic Auth header', async () => {
      let authHeader = '';

      // Capture the Authorization header
      nock('https://live.trading212.com')
        .get('/api/v0/equity/account/summary')
        .matchHeader('Authorization', (value) => {
          authHeader = value;
          return /^Basic /.test(value);
        })
        .reply(200, { totalValue: 100.00 });

      await request(app)
        .get('/accounts/trading212-stocks-isa/balance')
        .expect(200);

      expect(authHeader).toMatch(/^Basic /);
      // Verify it's valid base64
      const base64Part = authHeader.replace('Basic ', '');
      expect(() => Buffer.from(base64Part, 'base64').toString('utf-8')).not.toThrow();
    });

    it('should handle different balance values correctly', async () => {
      const testCases = [
        { totalValue: 0, expected: 0 },
        { totalValue: 999999.99, expected: 999999.99 },
        { totalValue: 0.01, expected: 0.01 },
      ];

      for (const testCase of testCases) {
        nock('https://live.trading212.com')
          .get('/api/v0/equity/account/summary')
          .reply(200, { totalValue: testCase.totalValue });

        const response = await request(app)
          .get('/accounts/trading212-stocks-isa/balance')
          .expect(200);

        expect(response.body.balance).toBe(testCase.expected);
        
        // Clean for next iteration
        nock.cleanAll();
      }
    });
  });

  describe('GET /balances', () => {
    it('should return all account balances', async () => {
      // Mock the external Trading212 API endpoints for both accounts
      nock('https://live.trading212.com')
        .get('/api/v0/equity/account/summary')
        .matchHeader('Authorization', /^Basic /)
        .reply(200, {
          totalValue: 5170.91
        })
        .get('/api/v0/equity/account/summary')
        .matchHeader('Authorization', /^Basic /)
        .reply(200, {
          totalValue: 3250.45
        });

      const response = await request(app)
        .get('/balances')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        balances: [
          {
            accountId: 'trading212-stocks-isa',
            accountName: 'Trading212 Stocks ISA',
            balance: 5170.91,
            currency: 'GBP'
          },
          {
            accountId: 'trading212-investment-account',
            accountName: 'Trading212 Investment Account',
            balance: 3250.45,
            currency: 'GBP'
          }
        ]
      });
    });

    it('should handle errors gracefully', async () => {
      // Mock network failures for both accounts
      nock('https://live.trading212.com')
        .get('/api/v0/equity/account/summary')
        .replyWithError('Network connection failed')
        .get('/api/v0/equity/account/summary')
        .replyWithError('Network connection failed');

      const response = await request(app)
        .get('/balances')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /health', () => {
    it('should return health status without making external calls', async () => {
      // Ensure no external HTTP calls are made
      nock.disableNetConnect();
      nock.enableNetConnect('127.0.0.1'); // Allow local connections for supertest

      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });

      // Restore network connections
      nock.enableNetConnect();
    });
  });
});
