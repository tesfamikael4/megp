/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Config } from '@/models/config';

export const config: Config = {
  ENV_MARKET_PLACE_API: process.env.ENV_MARKET_PLACE_API!,
};
