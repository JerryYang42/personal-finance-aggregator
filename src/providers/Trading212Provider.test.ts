import { jest } from '@jest/globals';
import type { AxiosResponse } from 'axios';

// Mock axios BEFORE importing Trading212Provider
const mockGet = jest.fn<() => Promise<AxiosResponse>>();

jest.unstable_mockModule('axios', () => ({
  default: {
    get: mockGet,
  },
}));

// Re-import modules AFTER mocking
const { Trading212Provider } = await import('./Trading212Provider.js');
const { Currency } = await import('../models/Currency.js');

describe('Trading212Provider', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch balance with correct headers', async () => {
    const provider = new Trading212Provider({ apiKey: 'key', apiSecret: 'secret' });
    
    mockGet.mockResolvedValue({ 
      data: { total: 100 },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    } as AxiosResponse);

    const result = await provider.getBalance();
    
    expect(result.balance).toBe(100);
    expect(result.currency).toBe(Currency.GBP);
    expect(mockGet).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { Authorization: expect.stringContaining('Basic ') }
      })
    );
  });
});