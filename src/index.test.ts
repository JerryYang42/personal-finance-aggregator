import request from 'supertest';
import { jest } from '@jest/globals';
import type { Express } from 'express';

// Mock the Trading212Provider BEFORE importing the app
const mockGetBalance = jest.fn<() => Promise<{ balance: number; currency: string }>>();
const mockGetName = jest.fn<() => string>();

jest.unstable_mockModule('./providers/Trading212Provider.js', () => ({
  Trading212Provider: jest.fn().mockImplementation(() => ({
    getBalance: mockGetBalance,
    getName: mockGetName
  }))
}));

describe('Integration Tests', () => {
  let app: Express;

  beforeAll(async () => {
    // Dynamically import the app AFTER mocks are set up
    const indexModule = await import('./index.js');
    app = indexModule.app;
  });

  beforeEach(() => {
    // Reset mocks before each test
    mockGetBalance.mockReset();
    mockGetName.mockReset();
    
    // Set default mock return values
    mockGetName.mockReturnValue('Trading212 Stocks ISA');
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
          }
        ]
      });
    });
  });

  describe('GET /accounts/:accountId/balance', () => {
    it('should return balance from Trading212', async () => {
      // Configure mock to return test data
      mockGetBalance.mockResolvedValue({
        balance: 1234.56,
        currency: 'GBP'
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
      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });

    it('should return 404 for non-existent account', async () => {
      const response = await request(app)
        .get('/accounts/non-existent-account/balance')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toHaveProperty('error');
      expect(response.body.error).toContain('not found');
    });

    it('should handle errors gracefully', async () => {
      // Configure mock to throw an error
      mockGetBalance.mockRejectedValue(new Error('API Error'));

      const response = await request(app)
        .get('/accounts/trading212-stocks-isa/balance')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /balances', () => {
    it('should return all account balances', async () => {
      // Configure mock to return test data
      mockGetBalance.mockResolvedValue({
        balance: 5170.91,
        currency: 'GBP'
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
          }
        ]
      });
      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      // Configure mock to throw an error
      mockGetBalance.mockRejectedValue(new Error('API Error'));

      const response = await request(app)
        .get('/balances')
        .expect('Content-Type', /json/)
        .expect(500);

      expect(response.body).toHaveProperty('error');
      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });
  });

  describe('GET /health', () => {
    it('should return health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({ status: 'ok' });
    });
  });
});