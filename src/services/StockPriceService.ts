import axios from 'axios';
import { Currency } from '../models/Currency.js';

// RELX PLC, London Stock Exchange listing (Alpha Vantage symbol format)
const RELX_UK_SYMBOL = 'REL.LON';

export interface StockPrice {
  symbol: string;
  price: number;
  currency: Currency;
}

export async function getRelxUkPrice(): Promise<StockPrice> {
  const apiKey = process.env.ALPHA_VANTAGE_API_KEY;
  if (!apiKey) {
    throw new Error('Missing ALPHA_VANTAGE_API_KEY environment variable');
  }

  const response = await axios.get('https://www.alphavantage.co/query', {
    params: {
      function: 'GLOBAL_QUOTE',
      symbol: RELX_UK_SYMBOL,
      apikey: apiKey
    }
  });

  const rawPrice = response.data?.['Global Quote']?.['05. price'];
  if (!rawPrice) {
    throw new Error(
      `No quote returned for ${RELX_UK_SYMBOL}: ${response.data?.Note || response.data?.Information || JSON.stringify(response.data)}`
    );
  }

  // Alpha Vantage quotes LSE listings in pence (GBX); convert to GBP.
  return {
    symbol: RELX_UK_SYMBOL,
    price: Number(rawPrice) / 100,
    currency: Currency.GBP
  };
}
