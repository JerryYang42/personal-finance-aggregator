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

  describe('GET /balance', () => {
    it('should return balance from Trading212 API', async () => {
      // Mock the external Trading212 API endpoint
      nock('https://live.trading212.com')
        .get('/api/v0/equity/account/cash')
        .matchHeader('Authorization', /^Basic /)
        .reply(200, {
          total: 1234.56
        });

      const response = await request(app)
        .get('/balance')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        source: 'Trading212 Stocks ISA',
        balance: 1234.56,
        currency: 'GBP'
      });
    });

    it('should handle API errors gracefully', async () => {
      // Mock a 500 error from Trading212 API
      nock('https://live.trading212.com')
        .get('/api/v0/equity/account/cash')
        .matchHeader('Authorization', /^Basic /)
        .reply(500, {
          message: 'Internal Server Error'
        });

      const response = await request(app)
        .get('/balance')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle network errors', async () => {
      // Mock a network failure
      nock('https://live.trading212.com')
        .get('/api/v0/equity/account/cash')
        .replyWithError('Network connection failed');

      const response = await request(app)
        .get('/balance')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('should handle unauthorized errors', async () => {
      // Mock a 401 Unauthorized response
      nock('https://live.trading212.com')
        .get('/api/v0/equity/account/cash')
        .matchHeader('Authorization', /^Basic /)
        .reply(401, {
          message: 'Invalid API credentials'
        });

      const response = await request(app)
        .get('/balance')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('error');
    });

    it('should send correct Basic Auth header', async () => {
      let authHeader = '';

      // Capture the Authorization header
      nock('https://live.trading212.com')
        .get('/api/v0/equity/account/cash')
        .matchHeader('Authorization', (value) => {
          authHeader = value;
          return /^Basic /.test(value);
        })
        .reply(200, { total: 100.00 });

      await request(app)
        .get('/balance')
        .expect(200);

      expect(authHeader).toMatch(/^Basic /);
      // Verify it's valid base64
      const base64Part = authHeader.replace('Basic ', '');
      expect(() => Buffer.from(base64Part, 'base64').toString('utf-8')).not.toThrow();
    });

    it('should handle different balance values correctly', async () => {
      const testCases = [
        { total: 0, expected: 0 },
        { total: 999999.99, expected: 999999.99 },
        { total: 0.01, expected: 0.01 },
      ];

      for (const testCase of testCases) {
        nock('https://live.trading212.com')
          .get('/api/v0/equity/account/cash')
          .reply(200, { total: testCase.total });

        const response = await request(app)
          .get('/balance')
          .expect(200);

        expect(response.body.balance).toBe(testCase.expected);
        
        // Clean for next iteration
        nock.cleanAll();
      }
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
