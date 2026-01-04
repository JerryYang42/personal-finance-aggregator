import axios from 'axios';
import { Currency } from '../models/Currency.js';
import type { HttpBasicAuthCredentials } from '../models/HttpBasicAuthCredentials.js';

export interface IBankProvider {
  getBalance(): Promise<{ balance: number; currency: string }>;
}

export class Trading212Provider implements IBankProvider {
  private readonly baseUrl = 'https://live.trading212.com/api/v0/equity/account/cash';
  
  constructor(private credentials: HttpBasicAuthCredentials) {}

  async getBalance() {
    // Trading 212 uses Basic Auth: base64(key:secret)
    const auth = Buffer.from(`${this.credentials.apiKey}:${this.credentials.apiSecret}`).toString('base64');
    
    const response = await axios.get(this.baseUrl, {
      headers: { Authorization: `Basic ${auth}` }
    });

    return {
      balance: response.data.total,
      currency: Currency.GBP
    };
  }
}
