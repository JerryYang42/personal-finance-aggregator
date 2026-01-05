# Personal Finance Aggregator

[![CI](https://github.com/JerryYang42/personal-finance-aggregator/actions/workflows/ci.yml/badge.svg)](https://github.com/JerryYang42/personal-finance-aggregator/actions/workflows/ci.yml)

A unified REST API service that aggregates account balances and financial data from multiple banking and investment platforms. Built to provide a single source of truth for personal finance tracking across various providers.

## Overview

Personal Finance Aggregator connects to multiple financial institutions through their APIs, normalizing the data into a consistent format. This enables building unified dashboards, budget trackers, or personal finance applications on top of a single API.

## Features

- 🏦 **Multi-Provider Support** - Connect to multiple banks and investment platforms
- 🔄 **Real-Time Balances** - Fetch current account balances across all connected accounts
- 🔐 **Secure Credential Management** - Environment-based configuration for API keys
- 🐳 **Docker Ready** - Containerized deployment with Docker Compose
- ✅ **Fully Tested** - Comprehensive test coverage with Jest
- 📊 **Type-Safe** - Written in TypeScript for enhanced reliability

## Technology Stack

- **Runtime**: Node.js 20+
- **Language**: TypeScript
- **Framework**: Express.js
- **Testing**: Jest with Supertest
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

## Supported Providers

| Provider | Account Type | Status | Requirements |
| --- | --- | --- | --- |
| Trading212 | Stock ISA | ✅ Full Support | [API Key](https://helpcentre.trading212.com/hc/en-us/articles/14584770928157-Trading-212-API-key) |
| Trading212 | Investment Account | ✅ Full Support | [API Key](https://helpcentre.trading212.com/hc/en-us/articles/14584770928157-Trading-212-API-key) |
| Revolut | Current Account | 🚧 Planned |  |
| Lloyds Bank | Debit Account | 🚧 Planned |  |
| Chase UK | Debit Account | 🚧 Planned |  |
| HSBC UK | Debit Account | 🚧 Planned |  |
| Monzo | Debit Account | 🚧 Planned |  |

## Getting Started

### Prerequisites

- Node.js >= 20.0.0
- Docker and Docker Compose (for containerized deployment)
- API credentials for supported providers

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/JerryYang42/personal-finance-aggregator.git
   cd personal-finance-aggregator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.template .env
   ```
   
   Edit `.env` and add your provider credentials:
   ```env
   TRADING212_API_KEY=your_api_key_here
   ```

### Running the Application

#### Using Docker (Recommended)

```bash
docker compose up --build
```

The API will be available at `http://localhost:3000`

#### Local Development

```bash
# Development mode with hot reload
npm run dev

# Production build
npm run build
npm start
```

### Running Tests

```bash
# Run all tests
npm test

# Watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

## API Documentation

### Get All Accounts

Retrieves a list of all configured accounts across providers.

**Endpoint:** `GET /accounts`

**Example Request:**
```bash
curl http://localhost:3000/accounts
```

**Response:**
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

Fetches current balances for all connected accounts.

**Endpoint:** `GET /balances`

**Example Request:**
```bash
curl http://localhost:3000/balances
```

**Response:**
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

## Project Structure

```
personal-finance-aggregator/
├── src/
│   ├── api/              # API route handlers
│   ├── config/           # Configuration files
│   ├── models/           # TypeScript interfaces and types
│   ├── providers/        # Provider-specific implementations
│   ├── services/         # Business logic services
│   └── index.ts          # Application entry point
├── docker-compose.yml    # Docker composition
├── Dockerfile           # Container definition
└── tsconfig.json        # TypeScript configuration
```

## Development

### Code Quality

The project uses:
- **ESLint** for code linting
- **Prettier** for code formatting
- **Husky** for Git hooks
- **lint-staged** for pre-commit checks

```bash
# Run linter
npm run lint
```

### Adding a New Provider

1. Create a new provider class in `src/providers/`
2. Implement the `Provider` interface
3. Add configuration to `src/config/providers.ts`
4. Write unit tests
5. Update this README

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the ISC License.

## Contact

Jerry Yang - [GitHub](https://github.com/JerryYang42)

Project Link: [https://github.com/JerryYang42/personal-finance-aggregator](https://github.com/JerryYang42/personal-finance-aggregator)
