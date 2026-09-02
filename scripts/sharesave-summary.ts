// Prints the current Sharesave scheme summary using the live RELX UK price.
import dotenv from 'dotenv';
dotenv.config();

const { getShareSaveSummary } = await import('../src/services/ShareSaveService.js');
const { relxSharesave2026 } = await import('../src/config/shareSaveSchemes.js');

const summary = await getShareSaveSummary(relxSharesave2026);

console.log(JSON.stringify(summary, null, 2));
