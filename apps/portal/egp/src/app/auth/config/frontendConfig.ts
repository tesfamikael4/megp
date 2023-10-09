import Router from 'next/navigation';
import Session from 'supertokens-web-js/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import EmailVerification from 'supertokens-web-js/recipe/emailverification';
import { logger } from '@megp/core-fe';

export const frontendConfig = (config) => {
  logger.log(config);
  return {
    appInfo: {
      appName: 'app',
      apiDomain: config.ENV_AUTH_API!,
      apiBasePath: config.ENV_API_BASE_PATH!,
      websiteDomain: config.ENV_WEBSITE_DOMAIN!,
      websiteBasePath: config.ENV_WEBSITE_BASE_PATH!,
    },
    recipeList: [
      Session.init(),
      ThirdPartyEmailPassword.init(),
      EmailVerification.init(),
    ],
  };
};
