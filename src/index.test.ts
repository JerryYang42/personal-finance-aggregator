import request from 'supertest';
import { app } from './index.js';

describe('Integration Tests', () => {
  describe('GET /balance', () => {
    it('should return balance from Trading212', async () => {
      const response = await request(app)
        .get('/balance')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toHaveProperty('source', 'Trading212 Stocks ISA');
      expect(response.body).toHaveProperty('balance');
      expect(response.body).toHaveProperty('currency');
      expect(typeof response.body.balance).toBe('number');
      expect(typeof response.body.currency).toBe('string');
    });

    it('should handle errors gracefully', async () => {
      // This test assumes the API might fail
      const response = await request(app).get('/balance');
      
      if (response.status === 500) {
        expect(response.body).toHaveProperty('error');
      } else {
        expect(response.status).toBe(200);
      }
    });
  });
});