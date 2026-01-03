# personal-finance-aggregator



## Log

```zsh
npm init -y
npm install typescript ts-node @types/node --save-dev
npx tsc --init

# install linter and prettier to keep the code clean as it grows
npm install --save-dev eslint prettier eslint-config-prettier husky lint-staged
```

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