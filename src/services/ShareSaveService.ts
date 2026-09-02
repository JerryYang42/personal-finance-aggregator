import { getRelxUkPrice } from './StockPriceService.js';
import type { ShareSaveScheme, ShareSaveSummary } from '../models/ShareSaveScheme.js';

export function calculateShareSaveSummary(scheme: ShareSaveScheme, sharePrice: number): ShareSaveSummary {
  const indicativeSchemeValue = scheme.sharesUnderOption * sharePrice;
  const potentialGain = indicativeSchemeValue - scheme.totalShareCost;

  return {
    ...scheme,
    sharePrice,
    indicativeSchemeValue,
    potentialGain
  };
}

export async function getShareSaveSummary(scheme: ShareSaveScheme): Promise<ShareSaveSummary> {
  const { price } = await getRelxUkPrice();
  return calculateShareSaveSummary(scheme, price);
}
