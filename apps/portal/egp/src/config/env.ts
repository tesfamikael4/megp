import { Config } from '@/models/config';

export const config: Config = {
  ENV_AUTH_API: process.env.ENV_AUTH_API!,
  ENV_AUTH_BASE_PATH: process.env.ENV_AUTH_BASE_PATH!,
  ENV_WEBSITE_DOMAIN: process.env.ENV_WEBSITE_DOMAIN!,
  ENV_WEBSITE_BASE_PATH: process.env.ENV_WEBSITE_BASE_PATH!,
  ENV_RECAPTCHA_SITE_KEY: process.env.ENV_RECAPTCHA_SITE_KEY!,
};
