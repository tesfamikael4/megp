import SessionReact from 'supertokens-auth-react/recipe/session';
import EmailPasswordReact from 'supertokens-auth-react/recipe/emailpassword';

export const frontendConfig = () => {
  return {
    appInfo: {
      appName: 'megp',
      apiDomain: 'http://196.189.44.47:3568',
      apiBasePath: '/auth',
      websiteDomain: 'http://localhost:5500',
      websiteBasePath: '/auth',
    },
    recipeList: [SessionReact.init(), EmailPasswordReact.init()],
  };
};
