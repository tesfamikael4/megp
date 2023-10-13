import { HttpException, Inject, Injectable, HttpStatus } from '@nestjs/common';
import supertokens from 'supertokens-node';
import Session from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword, {
  getUserById,
  updateEmailOrPassword,
} from 'supertokens-node/recipe/thirdpartyemailpassword';
import Dashboard from 'supertokens-node/recipe/dashboard';
import { ConfigInjectionToken, AuthModuleConfig } from '../config.interface';
import EmailVerification from 'supertokens-node/recipe/emailverification';
import { SMTPService as EmailVerificationSMTPService } from 'supertokens-node/recipe/emailverification/emaildelivery';
import { SMTPService } from 'supertokens-node/recipe/thirdpartyemailpassword/emaildelivery';
import UserRoles from 'supertokens-node/recipe/userroles';
import jwt from 'supertokens-node/lib/build/recipe/jwt';
import { UserAuthService } from 'src/users/services/user-auth.service';

@Injectable()
export class SupertokensService {
  constructor(
    @Inject(ConfigInjectionToken) config: AuthModuleConfig,
    userAuthService: UserAuthService,
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

                  const userInfo = await userAuthService.getUserInfo(userId);
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
          mode: 'OPTIONAL', // 'REQUIRED', // or "OPTIONAL"
          emailDelivery: {
            service: new EmailVerificationSMTPService({
              smtpSettings,
              override: (originalImplementation) => {
                return {
                  ...originalImplementation,
                  getContent: async function (input) {
                    // email verification content
                    const { emailVerifyLink, user } = input;

                    const supertokensUser = await getUserById(user.id);

                    // you can even call the original implementation and modify that
                    const originalContent =
                      await originalImplementation.getContent(input);
                    originalContent.body =
                      'Username: ' +
                      supertokensUser.email +
                      '<br>' +
                      originalContent.body;
                    return originalContent;
                  },
                };
              },
            }),
          },
          override: {
            apis: (originalImplementation) => {
              return {
                ...originalImplementation,
                verifyEmailPOST: async function (input) {
                  if (originalImplementation.verifyEmailPOST === undefined) {
                    throw Error('Should never come here');
                  }

                  // First we call the original implementation
                  const response =
                    await originalImplementation.verifyEmailPOST(input);

                  // Then we check if it was successfully completed
                  if (response.status === 'OK') {
                    const { id, email } = response.user;
                    await userAuthService.changeUserStatus(id);
                  }
                  return response;
                },
              };
            },
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
        UserRoles.init(),
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
                id: 'primaryEmail',
              },
              {
                id: 'primaryPhone',
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

                  const primaryEmail = input.formFields.find(
                    (e) => e.id == 'primaryEmail',
                  );
                  const password = input.formFields.find(
                    (e) => e.id == 'password',
                  );

                  const user = await userAuthService.canUserBeCreated(
                    primaryEmail.value,
                  );
                  if (user) {
                    if (user.status != 'DRAFT') {
                      throw new HttpException(
                        'email_already_exists',
                        HttpStatus.CONFLICT,
                      );
                    }

                    await updateEmailOrPassword({
                      userId: user.superTokenUserId,
                      password: password.value,
                      tenantIdForPasswordPolicy: 'public',
                    });

                    await EmailVerification.sendEmailVerificationEmail(
                      'public',
                      user.superTokenUserId,
                      primaryEmail.value,
                    );

                    const request = {
                      ...input,
                      formFields: [
                        {
                          id: 'email',
                          value: user.username,
                        },
                        {
                          id: 'password',
                          value: password.value,
                        },
                      ],
                    };

                    const response =
                      await originalImplementation.emailPasswordSignInPOST(
                        request,
                      );

                    return response as any;
                  }

                  input.formFields.forEach((field) => {
                    if (field.id == 'email') {
                      field.value = userAuthService.generateUsername();
                    }
                  });

                  // First we call the original implementation
                  const response =
                    await originalImplementation.emailPasswordSignUpPOST(input);

                  // If sign up was successful
                  if (response.status === 'OK') {
                    // We can get the form fields from the input like this
                    const formFields = input.formFields;
                    const user = response.user;

                    await userAuthService.registerUser(user, formFields);

                    await EmailVerification.sendEmailVerificationEmail(
                      'public',
                      response.user.id,
                      primaryEmail.value,
                      response,
                    );

                    response.user['isSecurityQuestionSet'] = false;
                  }

                  return response;
                },
                emailPasswordSignInPOST: async function (input) {
                  const response =
                    await originalImplementation.emailPasswordSignInPOST(input);

                  if (response.status === 'OK') {
                    const isSecurityQuestionSet =
                      await userAuthService.isSecurityQuestionSet(
                        response.user.id,
                      );
                    response.user['isSecurityQuestionSet'] =
                      isSecurityQuestionSet;
                  }

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
