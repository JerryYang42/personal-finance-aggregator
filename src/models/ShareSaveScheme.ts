export interface ShareSaveScheme {
  name: string;
  startDate: string;
  maturityDate: string;
  missedContributions: number;
  remainingContributions: number;
  bonusRate: number;
  withdrawalInterestRate: number;
  optionPrice: number;
  sharesUnderOption: number;
  monthlySavings: number;
  savingsToDate: number;
  totalShareCost: number;
}

export interface ShareSaveSummary extends ShareSaveScheme {
  sharePrice: number;
  indicativeSchemeValue: number;
  potentialGain: number;
}
