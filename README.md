# personal-finance-aggregator

## Support

### 1. Trading212

How to find the access key?
https://helpcentre.trading212.com/hc/en-us/articles/14584770928157-Trading-212-API-key



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
```

```zsh
# run tests
npx jest

```