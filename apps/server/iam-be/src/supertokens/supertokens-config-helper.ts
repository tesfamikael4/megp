import * as dotenv from 'dotenv';
dotenv.config({ path: '.env' });

export const SupertokensConfigHelper = {
  CONNECTION_URI: process.env.CONNECTION_URI,
  API_KEY: process.env.API_KEY,
  APP_NAME: process.env.APP_NAME,
  API_DOMAIN: process.env.API_DOMAIN,
  WEBSITE_DOMAIN: process.env.WEBSITE_DOMAIN,
  API_BASE_PATH: process.env.API_BASE_PATH,
  WEBSITE_BASE_PATH: process.env.WEBSITE_BASE_PATH,
};
