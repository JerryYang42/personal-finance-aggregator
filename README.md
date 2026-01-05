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


## API Endpoints

### Get All Accounts

```bash
GET /accounts
```

Returns a list of all configured accounts.

**Example Response:**
```json
{
  "accounts": [
    {
      "id": "trading212-stocks-isa",
      "name": "Trading212 Stocks ISA",
      "type": "investment"
    },
    {
      "id": "trading212-investment-account",
      "name": "Trading212 Investment Account",
      "type": "investment"
    }
  ]
}
```

### Get All Balances

```bash
GET /balances
```

Returns current balances for all configured accounts.

**Example Response:**
```json
{
  "balances": [
    {
      "accountId": "trading212-stocks-isa",
      "accountName": "Trading212 Stocks ISA",
      "balance": 1234567.89,
      "currency": "GBP"
    },
    {
      "accountId": "trading212-investment-account",
      "accountName": "Trading212 Investment Account",
      "balance": 9876543.21,
      "currency": "GBP"
    }
  ]
}
```

## Start the app locally

```
mv .env.template .env
# Edit .env to add credentials
docker compose up --build
```
