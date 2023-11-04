/* eslint-disable turbo/no-undeclared-env-vars */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { Config } from '@/models/config';

export const config: Config = {
  ENV_ADMINISTRATION_API: process.env.ENV_ADMINISTRATION_API!,
};
