import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword';

type LoginWithEmailPasswordArgs = {
  email: string;
  password: string;
};

export const signinWithEmailPassword = async ({
  email,
  password,
}: LoginWithEmailPasswordArgs) => {
  return ThirdPartyEmailPassword.emailPasswordSignIn({
    formFields: [
      {
        id: 'email',
        value: email,
      },
      {
        id: 'password',
        value: password,
      },
    ],
  });
};

export const signupWithEmailPassword = async ({
  email,
  password,
}: LoginWithEmailPasswordArgs) => {
  return ThirdPartyEmailPassword.emailPasswordSignUp({
    formFields: [
      {
        id: 'email',
        value: email,
      },
      {
        id: 'password',
        value: password,
      },
    ],
  });
};

export const requestPassword = async ({ email }: { email: string }) => {
  return ThirdPartyEmailPassword.sendPasswordResetEmail({
    formFields: [
      {
        id: 'email',
        value: email,
      },
    ],
  });
};

export const resetPassword = async ({ password }: { password: string }) => {
  return ThirdPartyEmailPassword.submitNewPassword({
    formFields: [
      {
        id: 'password',
        value: password,
      },
    ],
  });
};
