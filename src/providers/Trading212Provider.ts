import axios from 'axios';

export interface IBankProvider {
  getBalance(): Promise<{ balance: number; currency: string }>;
}

export class Trading212Provider implements IBankProvider {
  private readonly baseUrl = 'https://live.trading212.com/api/v0/equity/account/cash';
  
  constructor(private apiKey: string, private apiSecret: string) {}

  async getBalance() {
    // Trading 212 uses Basic Auth: base64(key:secret)
    const auth = Buffer.from(`${this.apiKey}:${this.apiSecret}`).toString('base64');
    
    const response = await axios.get(this.baseUrl, {
      headers: { Authorization: `Basic ${auth}` }
    });

    return {
      balance: response.data.total,
      currency: "GBP"
    };
  }
}
