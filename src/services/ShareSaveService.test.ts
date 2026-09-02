import { jest } from '@jest/globals';
import type { ShareSaveScheme } from '../models/ShareSaveScheme.js';

const mockGetRelxUkPrice = jest.fn<() => Promise<{ symbol: string; price: number; currency: string }>>();

jest.unstable_mockModule('./StockPriceService.js', () => ({
  getRelxUkPrice: mockGetRelxUkPrice
}));

const { calculateShareSaveSummary, getShareSaveSummary } = await import('./ShareSaveService.js');

const scheme: ShareSaveScheme = {
  name: 'RELX PLC 2026 3yr',
  startDate: '2026-08-01',
  maturityDate: '2029-08-01',
  missedContributions: 0,
  remainingContributions: 35,
  bonusRate: 1.1,
  withdrawalInterestRate: 0.0142,
  optionPrice: 19.728,
  sharesUnderOption: 922,
  monthlySavings: 500,
  savingsToDate: 500,
  totalShareCost: 18538.88
};

describe('calculateShareSaveSummary', () => {
  it('derives indicative scheme value from shares under option and share price', () => {
    const summary = calculateShareSaveSummary(scheme, 26.12);

    expect(summary.indicativeSchemeValue).toBeCloseTo(24082.64, 2);
  });

  it('derives potential gain as indicative scheme value minus total share cost', () => {
    const summary = calculateShareSaveSummary(scheme, 26.12);

    expect(summary.potentialGain).toBeCloseTo(summary.indicativeSchemeValue - scheme.totalShareCost, 2);
  });
});

describe('getShareSaveSummary', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches the live RELX price and folds it into the scheme summary', async () => {
    mockGetRelxUkPrice.mockResolvedValue({ symbol: 'REL.LON', price: 26.12, currency: 'GBP' });

    const summary = await getShareSaveSummary(scheme);

    expect(summary.sharePrice).toBe(26.12);
    expect(summary.indicativeSchemeValue).toBeCloseTo(24082.64, 2);
    expect(summary.potentialGain).toBeCloseTo(5543.76, 2);
  });
});
