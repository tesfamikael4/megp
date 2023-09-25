import Router from 'next/navigation';
import Session from 'supertokens-web-js/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import EmailVerification from 'supertokens-web-js/recipe/emailverification';

export const frontendConfig = () => {
  return {
    appInfo: {
      appName: 'app',
      // apiDomain: 'http://localhost:3568',
      apiDomain: process.env['NEXT_PUBLIC_AUTH_API']!,
      apiBasePath: process.env['NEXT_PUBLIC_API_BASE_PATH']!,
      websiteDomain: process.env['NEXT_PUBLIC_WEBSITE_DOMAIN']!,
      websiteBasePath: process.env['NEXT_PUBLIC_WEBSITE_BASE_PATH']!,
    },
    recipeList: [
      Session.init(),
      ThirdPartyEmailPassword.init(),
      EmailVerification.init(),
    ],
  };
};
