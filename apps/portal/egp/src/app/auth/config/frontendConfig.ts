import SessionReact from 'supertokens-auth-react/recipe/session';
import ThirdPartyEmailPasswordReact from 'supertokens-auth-react/recipe/thirdpartyemailpassword';
import EmailVerificationReact from 'supertokens-auth-react/recipe/emailverification';
import Router from 'next/router';

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
      SessionReact.init(),
      ThirdPartyEmailPasswordReact.init(),
      EmailVerificationReact.init(),
    ],
    windowHandler: (oI) => {
      return {
        ...oI,
        location: {
          ...oI.location,
          setHref: (href) => {
            Router.push(href);
          },
        },
      };
    },
  };
};
