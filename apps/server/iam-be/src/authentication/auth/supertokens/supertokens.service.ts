import { Inject, Injectable } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import Dashboard from 'supertokens-node/recipe/dashboard';
import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';
import { OrganizationService } from 'src/organization';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import { SMTPService as EmailVerificationSMTPService } from 'supertokens-node/recipe/emailverification/emaildelivery';
import { SMTPService } from 'supertokens-node/recipe/thirdpartyemailpassword/emaildelivery';
import UserRoles from 'supertokens-node/recipe/userroles';
import jwt from 'supertokens-node/lib/build/recipe/jwt';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(ConfigInjectionToken) config: AuthModuleConfig,
    organizationService: OrganizationService,
  ) {
    const smtpSettings = {
      host: process.env.SMTP_HOST,
      password: process.env.SMTP_PASSWORD,
      port: Number(process.env.SMTP_PORT),
      from: {
        name: 'Account Control',
        email: process.env.SMTP_EMAIL,
      },
      secure: false,
    };

    supertokens.init({
      appInfo: config.appInfo,
      supertokens: {
        connectionURI: config.connectionURI,
        apiKey: config.apiKey,
      },
      recipeList: [
        Session.init({
          exposeAccessTokenToFrontendInCookieBasedAuth: true,
          useDynamicAccessTokenSigningKey: false,
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                createNewSession: async function (input) {
                  const userId = input.userId;

                  const userInfo =
                    await organizationService.getUserInfo(userId);
                  // if (userInfo.firstName == 'Test') {
                  //   throw Error('user banned');
                  // }

                  input.accessTokenPayload = {
                    ...input.accessTokenPayload,
                    userInfo,
                  };

                  return originalImplementation.createNewSession(input);
                },
              };
            },
          },
        }),
        EmailVerification.init({
          mode: 'REQUIRED', // or "OPTIONAL"
          emailDelivery: {
            service: new EmailVerificationSMTPService({ smtpSettings }),
          },
        }),
        Dashboard.init(),
        jwt.init({
          override: {
            functions: (originalImplementation) => {
              return {
                ...originalImplementation,
                createJWT: async function (input) {
                  input.useStaticSigningKey = true;

                  const response =
                    await originalImplementation.createJWT(input);
                  return response;
                },
              };
            },
          },
        }),
        ThirdPartyEmailPassword.init({
          signUpFeature: {
            formFields: [
              {
                id: 'email',
                validate: async (value, tenantId) => {
                  return undefined; // Your own validation returning a string or undefined if no errors.
                },
              },
              {
                id: 'password',
                validate: async (value, tenantId) => {
                  return undefined; // Your own validation returning a string or undefined if no errors.
                },
              },
              {
                id: 'firstName',
              },
              {
                id: 'lastName',
              },
              {
                id: 'organizationName',
              },
              {
                id: 'securityQuestions',
                optional: true,
              },
            ],
          },
          emailDelivery: {
            service: new SMTPService({ smtpSettings }),
          },
          override: {
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                emailPasswordSignUpPOST: async function (input) {
                  if (
                    originalImplementation.emailPasswordSignUpPOST === undefined
                  ) {
                    throw Error('Should never come here');
                  }

                  // First we call the original implementation
                  const response =
                    await originalImplementation.emailPasswordSignUpPOST(input);

                  // If sign up was successful
                  if (response.status === 'OK') {
                    // We can get the form fields from the input like this
                    const formFields = input.formFields;
                    const user = response.user;

                    await organizationService.registerOrganization(
                      user,
                      formFields,
                    );
                  }

                  return response;
                },
                emailPasswordSignInPOST: async function (input) {
                  const response =
                    await originalImplementation.emailPasswordSignInPOST(input);

                  return response;
                },
              };
            },
          },
          providers: [
            {
              config: {
                thirdPartyId: 'google',
                clients: [
                  {
                    clientId:
                      '1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com',
                    clientSecret: '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',
                  },
                ],
              },
            },
            {
              config: {
                thirdPartyId: 'github',
                clients: [
                  {
                    clientId: '467101b197249757c71f',
                    clientSecret: 'e97051221f4b6426e8fe8d51486396703012f5bd',
                  },
                ],
              },
            },
            {
              config: {
                thirdPartyId: 'apple',
                clients: [
                  {
                    clientId: '4398792-io.supertokens.example.service',
                    additionalConfig: {
                      keyId: '7M48Y4RYDL',
                      privateKey:
                        '-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----',
                      teamId: 'YWQCXGJRJL',
                    },
                  },
                ],
              },
            },
          ],
        }),
      ],
    });
  }
}
