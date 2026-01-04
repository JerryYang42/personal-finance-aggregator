import request from 'supertest';
import { jest } from '@jest/globals';
import type { Express } from 'express';

// Mock the Trading212Provider BEFORE importing the app
const mockGetBalance = jest.fn<() => Promise<{ balance: number; currency: string }>>();

jest.unstable_mockModule('./providers/Trading212Provider.js', () => ({
  Trading212Provider: jest.fn().mockImplementation(() => ({
    getBalance: mockGetBalance
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
    // Reset mock before each test
    mockGetBalance.mockReset();
  });

  describe('GET /balance', () => {
    it('should return balance from Trading212', async () => {
      // Configure mock to return test data
      mockGetBalance.mockResolvedValue({
        balance: 1234.56,
        currency: 'GBP'
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
      expect(mockGetBalance).toHaveBeenCalledTimes(1);
    });

    it('should handle errors gracefully', async () => {
      // Configure mock to throw an error
      mockGetBalance.mockRejectedValue(new Error('API Error'));

      const response = await request(app)
        .get('/balance')
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