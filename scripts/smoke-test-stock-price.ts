// Fetches the live RELX UK price via Alpha Vantage and prints it, using the real .env credentials.
import dotenv from 'dotenv';
dotenv.config();

const { getRelxUkPrice } = await import('../src/services/StockPriceService.js');

const result = await getRelxUkPrice();
console.log(result);

if (!(result.price > 0)) {
  console.error('FAIL: price was not a positive number');
  process.exit(1);
}

console.log('PASS: got a live RELX UK price in GBP');
