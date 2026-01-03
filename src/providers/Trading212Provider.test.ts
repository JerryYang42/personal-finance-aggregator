import { Trading212Provider } from './Trading212Provider';
import axios from 'axios';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Trading212Provider', () => {
  it('should fetch balance with correct headers', async () => {
    const provider = new Trading212Provider('key', 'secret');
    mockedAxios.get.mockResolvedValue({ data: { total: 100, currency: 'GBP' } });

    const result = await provider.getBalance();
    
    expect(result.cash).toBe(100);
    expect(mockedAxios.get).toHaveBeenCalledWith(
      expect.any(String),
      expect.objectContaining({
        headers: { Authorization: expect.stringContaining('Basic ') }
      })
    );
  });
});