/**
 * Environment variable validation
 * Ensures all required environment variables are set at startup
 */

interface RequiredEnvVars {
  TRADING212_STOCKS_ISA_API_KEY: string;
  TRADING212_STOCKS_ISA_SECRET_KEY: string;
  TRADING212_INVESTMENT_ACCOUNT_API_KEY: string;
  TRADING212_INVESTMENT_ACCOUNT_SECRET_KEY: string;
  PORT?: string;
  NODE_ENV?: string;
}

export function validateEnv(): void {
  const required: (keyof RequiredEnvVars)[] = [
    'TRADING212_STOCKS_ISA_API_KEY',
    'TRADING212_STOCKS_ISA_SECRET_KEY',
    'TRADING212_INVESTMENT_ACCOUNT_API_KEY',
    'TRADING212_INVESTMENT_ACCOUNT_SECRET_KEY'
  ];

  const missing: string[] = [];
  const empty: string[] = [];

  for (const varName of required) {
    if (!(varName in process.env)) {
      missing.push(varName);
    } else if (process.env[varName]?.trim() === '') {
      empty.push(varName);
    }
  }

  if (missing.length > 0 || empty.length > 0) {
    const errors: string[] = [];
    
    if (missing.length > 0) {
      errors.push(`Missing required environment variables: ${missing.join(', ')}`);
    }
    
    if (empty.length > 0) {
      errors.push(`Empty environment variables: ${empty.join(', ')}`);
    }

    errors.push('\nPlease set these variables:');
    errors.push('- Copy .env.template to .env and fill in values');
    errors.push('- Or set environment variables directly in your deployment');
    
    throw new Error(errors.join('\n'));
  }

  // Validate NODE_ENV if set
  const validNodeEnvs = ['development', 'production', 'test'];
  const nodeEnv = process.env.NODE_ENV;
  if (nodeEnv && !validNodeEnvs.includes(nodeEnv)) {
    console.warn(`Warning: NODE_ENV="${nodeEnv}" is not standard. Expected one of: ${validNodeEnvs.join(', ')}`);
  }

  // Validate PORT if set
  const port = process.env.PORT;
  if (port && (isNaN(Number(port)) || Number(port) < 1 || Number(port) > 65535)) {
    throw new Error(`Invalid PORT: ${port}. Must be a number between 1 and 65535`);
  }
}
