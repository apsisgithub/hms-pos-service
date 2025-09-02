import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

// Load environment variables from .env file
const envFilePath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envFilePath)) {
  dotenv.config({ path: envFilePath });
}

// Function to get environment variables with validation
export function getEnvVariable(key: string, throwOnMissing:string | boolean = true) {
  const value = process.env[key];
  if (!value && throwOnMissing) {
    throw new Error(`Environment variable ${key} is not set`);
  }
  return value;
}

export const DB_HOST = getEnvVariable('DB_HOST', '');
export const DB_NAME = getEnvVariable('DB_NAME', '');
export const DB_USER = getEnvVariable('DB_USER', '');
export const DB_PASSWORD = getEnvVariable('DB_PASS', '');
export const DB_PORT = getEnvVariable('DB_PORT', '');