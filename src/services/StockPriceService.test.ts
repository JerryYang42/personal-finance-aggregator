import { jest } from '@jest/globals';
import type { AxiosResponse } from 'axios';

const mockGet = jest.fn<() => Promise<AxiosResponse>>();

jest.unstable_mockModule('axios', () => ({
  default: {
    get: mockGet
  }
}));

const { getRelxUkPrice } = await import('./StockPriceService.js');
const { Currency } = await import('../models/Currency.js');

describe('getRelxUkPrice', () => {
  const originalApiKey = process.env.ALPHA_VANTAGE_API_KEY;

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.ALPHA_VANTAGE_API_KEY = 'test-key';
  });

  afterAll(() => {
    process.env.ALPHA_VANTAGE_API_KEY = originalApiKey;
  });

  it('converts the pence-denominated LSE price to GBP', async () => {
    mockGet.mockResolvedValue({
      data: { 'Global Quote': { '05. price': '3456.00' } },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    } as AxiosResponse);

    const result = await getRelxUkPrice();

    expect(result).toEqual({ symbol: 'REL.LON', price: 34.56, currency: Currency.GBP });
    expect(mockGet).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        params: expect.objectContaining({ symbol: 'REL.LON', apikey: 'test-key' })
      })
    );
  });

  it('throws when the API key is missing', async () => {
    delete process.env.ALPHA_VANTAGE_API_KEY;

    await expect(getRelxUkPrice()).rejects.toThrow('Missing ALPHA_VANTAGE_API_KEY');
  });

  it('throws a descriptive error when no quote is returned', async () => {
    mockGet.mockResolvedValue({
      data: { Note: 'Thank you for using Alpha Vantage! Our standard API rate limit is...' },
      status: 200,
      statusText: 'OK',
      headers: {},
      config: {} as any
    } as AxiosResponse);

    await expect(getRelxUkPrice()).rejects.toThrow('No quote returned for REL.LON');
  });
});
