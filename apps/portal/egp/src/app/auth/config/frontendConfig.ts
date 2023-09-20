import Router from 'next/navigation';
import Session from 'supertokens-web-js/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import EmailVerification from 'supertokens-web-js/recipe/emailverification';

export const frontendConfig = () => {
  return {
    appInfo: {
      appName: 'app',
      // apiDomain: 'http://localhost:3568',
      apiDomain: 'http://196.189.44.47:3568',
      apiBasePath: '/auth',
      websiteDomain: 'http://localhost:5500',
      websiteBasePath: '/auth',
    },
    recipeList: [
      Session.init(),
      ThirdPartyEmailPassword.init(),
      EmailVerification.init(),
    ],
  };
};
