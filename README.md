# personal-finance-aggregator

[![CI](https://github.com/JerryYang42/personal-finance-aggregator/actions/workflows/ci.yml/badge.svg)](https://github.com/JerryYang42/personal-finance-aggregator/actions/workflows/ci.yml)

## Supported Bank Accounts

| Bank | Account | Support | Notes |
| --- | --- | --- | --- |
| Trading212 | Stock ISA | ✅ | access key is required. [How to find it?](https://helpcentre.trading212.com/hc/en-us/articles/14584770928157-Trading-212-API-key) |
| Trading212 | Invest | ✅ | access key is required. [How to find it?](https://helpcentre.trading212.com/hc/en-us/articles/14584770928157-Trading-212-API-key) |
| Revolut | | ⚠️ |  |
| Lloyds Bank | Debit | ⚠️ |  |
| Chase UK | Debit | ⚠️ |  |
| HSBC UK | Debit | ⚠️ |  |
| Monzo | Debit | ⚠️ |  |

## Support

### 1. Trading212

How to find the access key?
https://helpcentre.trading212.com/hc/en-us/articles/14584770928157-Trading-212-API-key


## Usage

Use:

```zsh
# Development (tsx watch with hot reload)
npm run dev
# Production (compiled, optimized)
npm run build && npm start
# Quick testing without build (keep as backup)
npm run start:ts 
```
