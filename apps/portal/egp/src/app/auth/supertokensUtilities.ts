import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword';
import {
  doesSessionExist,
  getAccessTokenPayloadSecurely,
} from 'supertokens-web-js/recipe/session';

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

export const getAccessTokenPayload = async () => {
  // 1. check if valid session, if not return null
  const validSession = await doesSessionExist();
  if (!validSession) return null;
  const payload = await getAccessTokenPayloadSecurely();

  if (!payload) return null;

  return payload;
};
