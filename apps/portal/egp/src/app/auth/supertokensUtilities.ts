import ThirdPartyEmailPassword from 'supertokens-web-js/recipe/thirdpartyemailpassword';

type LoginWithEmailPasswordArgs = {
  email: string;
  password: string;
};

type SignUpWithEmailPasswordArgs = {
  email?: string;
  password: string;
  organizationName: string;
  firstName: string;
  lastName: string;
  primaryEmail: string;
  primaryPhone: string;
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
  organizationName,
  firstName,
  lastName,
  primaryEmail,
  primaryPhone,
}: SignUpWithEmailPasswordArgs) => {
  return ThirdPartyEmailPassword.emailPasswordSignUp({
    formFields: [
      {
        id: 'email',
        value: 'x',
      },
      {
        id: 'password',
        value: password,
      },
      {
        id: 'organizationName',
        value: organizationName,
      },
      {
        id: 'firstName',
        value: firstName,
      },
      {
        id: 'lastName',
        value: lastName,
      },
      {
        id: 'primaryEmail',
        value: primaryEmail,
      },
      {
        id: 'primaryPhone',
        value: primaryPhone,
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
