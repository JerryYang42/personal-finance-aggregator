// Prints the current Sharesave scheme summary using the live RELX UK price.
import dotenv from 'dotenv';
dotenv.config();

const { getShareSaveSummary } = await import('../src/services/ShareSaveService.js');
const { relxSharesave2026 } = await import('../src/config/shareSaveSchemes.js');

const summary = await getShareSaveSummary(relxSharesave2026);

console.log(`Scheme: ${summary.name}`);
console.log(`Start date: ${summary.startDate}`);
console.log(`Maturity date: ${summary.maturityDate}`);
console.log(`Missed contributions: ${summary.missedContributions}`);
console.log(`Remaining contributions: ${summary.remainingContributions}`);
console.log(`Option price: £${summary.optionPrice.toFixed(4)}`);
console.log(`Shares under option: ${summary.sharesUnderOption}`);
console.log(`Monthly savings: £${summary.monthlySavings.toFixed(2)}`);
console.log(`Savings to date: £${summary.savingsToDate.toFixed(2)}`);
console.log(`Total share cost: £${summary.totalShareCost.toFixed(2)}`);
console.log(`Share price: £${summary.sharePrice.toFixed(4)}`);
console.log(`Indicative scheme value: £${summary.indicativeSchemeValue.toFixed(2)}`);
console.log(`Potential gain: £${summary.potentialGain.toFixed(2)}`);
