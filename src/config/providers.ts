import { Trading212Provider } from '../providers/Trading212Provider.js';

export const PROVIDER_CONFIGS = [
  {
    id: 'trading212-stocks-isa',
    provider: new Trading212Provider(
      {
        apiKey: process.env.TRADING212_STOCKS_ISA_API_KEY || '',
        apiSecret: process.env.TRADING212_STOCKS_ISA_SECRET_KEY || ''
      },
      'Trading212 Stocks ISA'
    ),
    accountType: 'investment' as const
  },
  {
    id: 'trading212-investment-account',
    provider: new Trading212Provider(
      {
        apiKey: process.env.TRADING212_INVESTMENT_ACCOUNT_API_KEY || '',
        apiSecret: process.env.TRADING212_INVESTMENT_ACCOUNT_SECRET_KEY || ''
      },
      'Trading212 Investment Account'
    ),
    accountType: 'investment' as const
  }
] as const;
