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

## Dependencies

What you're using:

✅ tsx - For development (npm run dev)
✅ tsc - For building (npm run build)
✅ node - For production (npm start)
✅ ts-jest - For testing (handles TypeScript in Jest)

What's NOT being used:

❌ ts-node

## Project Structure

```txt
src/api/ - Routes and Controllers
src/services/ - Business Logic
src/providers/ - External API wrappers
src/models/ - TypeScript Interfaces & Schemas
src/config/ - Environment variables & Constants
index.ts - Entry point
.env - Environment variables template
.dockerignore - Docker ignore patterns
Dockerfile - Docker configuration
docker-compose.yml - Docker Compose setup
```

## Log

```zsh
npm init -y
npm install typescript ts-node @types/node --save-dev
npx tsc --init

# install linter and prettier to keep the code clean as it grows
npm install --save-dev eslint prettier eslint-config-prettier husky lint-staged

# install dependencies
npm install express dotenv axios
npm install --save-dev jest ts-jest @types/jest @types/express supertest @types/supertest

# install node for Buffer
npm i --save-dev @types/node

# install unit test lib
npm install --save-dev jest @types/jest ts-jest

# install tsx
npm install --save-dev tsx

# install eslint
npm install --save-dev @eslint/js typescript-eslint

# install nock, HTTP-level interceptor mock, for integration test purpose
npm install --save-dev nock @types/nock
```

```zsh
# run tests
npx jest

```