import { Inject, Injectable } from '@nestjs/common';
import supertokens from "supertokens-node";
import Session from 'supertokens-node/recipe/session';
import ThirdPartyEmailPassword from 'supertokens-node/recipe/thirdpartyemailpassword';
import Dashboard from "supertokens-node/recipe/dashboard";

import { ConfigInjectionToken, AuthModuleConfig } from "../config.interface";

@Injectable()
export class SupertokensService {
    constructor(@Inject(ConfigInjectionToken) private config: AuthModuleConfig) {
        supertokens.init({
            appInfo: config.appInfo,
            supertokens: {
                connectionURI: config.connectionURI,
                apiKey: config.apiKey,
            },
            recipeList: [
                Session.init({
                    exposeAccessTokenToFrontendInCookieBasedAuth: true,
                }),
                Dashboard.init(),
                // ThirdPartyEmailPassword.init({
                //     // We have provided you with development keys which you can use for testing.
                //     // IMPORTANT: Please replace them with your own OAuth keys for production use.
                //     providers: [{
                //         config: {
                //             thirdPartyId: "google",
                //             clients: [{
                //                 clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                //                 clientSecret: "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"
                //             }]
                //         }
                //     }, {
                //         config: {
                //             thirdPartyId: "github",
                //             clients: [{
                //                 clientId: "467101b197249757c71f",
                //                 clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd"
                //             }]
                //         }
                //     }, {
                //         config: {
                //             thirdPartyId: "apple",
                //             clients: [{
                //                 clientId: "4398792-io.supertokens.example.service",
                //                 additionalConfig: {
                //                     keyId: "7M48Y4RYDL",
                //                     privateKey:
                //                         "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                //                     teamId: "YWQCXGJRJL",
                //                 }
                //             }]
                //         }
                //     }],
                // },
                // ),
                ThirdPartyEmailPassword.init({
                    override: {
                        functions: (originalImplementation) => {
                            return {
                                ...originalImplementation,

                                // override the email password sign up function
                                emailPasswordSignUp: async function (input) {
                                    // TODO: some pre sign up logic

                                    let response = await originalImplementation.emailPasswordSignUp(input);

                                    if (response.status === "OK") {
                                        // TODO: some post sign up logic
                                    }

                                    return response;
                                },

                                // override the email password sign in function
                                emailPasswordSignIn: async function (input) {
                                    // TODO: some pre sign in logic

                                    let response = await originalImplementation.emailPasswordSignIn(input);

                                    if (response.status === "OK") {
                                        // TODO: some post sign in logic
                                    }

                                    return response;
                                },

                                // override the thirdparty sign in / up function
                                thirdPartySignInUp: async function (input) {
                                    // TODO: Some pre sign in / up logic

                                    let response = await originalImplementation.thirdPartySignInUp(input);

                                    if (response.status === "OK") {

                                        let accessToken = response.oAuthTokens["access_token"];

                                        let firstName = response.rawUserInfoFromProvider.fromUserInfoAPI!["first_name"];

                                        if (response.createdNewUser) {
                                            // TODO: some post sign up logic
                                        } else {
                                            // TODO: some post sign in logic
                                        }
                                    }

                                    return response;
                                }
                            }
                        }
                    }
                }),
            ]
        });
    }
}