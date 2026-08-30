import axios from 'axios';
import { Currency } from '../models/Currency.js';
import type { HttpBasicAuthCredentials } from '../models/HttpBasicAuthCredentials.js';
import type { Provider } from './Provider.js';

export interface IBankProvider {
  getBalance(): Promise<{ balance: number; currency: string }>;
}

export class Trading212Provider implements Provider, IBankProvider {
  private readonly baseUrl = 'https://live.trading212.com/api/v0/equity/account/summary';
  
  constructor(
    private credentials: HttpBasicAuthCredentials,
    private accountName: string = 'Trading212'
  ) {}

  getName(): string {
    return this.accountName;
  }

  async getBalance() {
    // Trading 212 uses Basic Auth: base64(key:secret)
    const auth = Buffer.from(`${this.credentials.apiKey}:${this.credentials.apiSecret}`).toString('base64');
    
    const response = await axios.get(this.baseUrl, {
      headers: { Authorization: `Basic ${auth}` }
    });

    return {
      balance: response.data.totalValue,
      currency: Currency.GBP
    };
  }
}
