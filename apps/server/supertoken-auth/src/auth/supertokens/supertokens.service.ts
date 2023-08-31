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
                ThirdPartyEmailPassword.init({
                    signUpFeature: {
                        formFields: [
                            {
                                id: "firstName"
                            },
                            {
                                id: "lastName"
                            },
                        ]
                    },
                    override: {
                        apis: (originalImplementation) => {
                            return {
                                ...originalImplementation,
                                emailPasswordSignUpPOST: async function (input) {
                                    if (originalImplementation.emailPasswordSignUpPOST === undefined) {
                                        throw Error("Should never come here");
                                    }

                                    // First we call the original implementation
                                    let response = await originalImplementation.emailPasswordSignUpPOST(input);

                                    // If sign up was successful
                                    if (response.status === "OK") {

                                        // We can get the form fields from the input like this
                                        let formFields = input.formFields
                                        let user = response.user

                                        // some post sign up logic
                                    }

                                    return response;
                                }
                            }
                        }
                    },
                    providers: [
                        {
                            config: {
                                thirdPartyId: "google",
                                clients: [{
                                    clientId: "1060725074195-kmeum4crr01uirfl2op9kd5acmi9jutn.apps.googleusercontent.com",
                                    clientSecret: "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"
                                }]
                            }
                        },
                        {
                            config: {
                                thirdPartyId: "github",
                                clients: [{
                                    clientId: "467101b197249757c71f",
                                    clientSecret: "e97051221f4b6426e8fe8d51486396703012f5bd"
                                }]
                            }
                        },
                        {
                            config: {
                                thirdPartyId: "apple",
                                clients: [{
                                    clientId: "4398792-io.supertokens.example.service",
                                    additionalConfig: {
                                        keyId: "7M48Y4RYDL",
                                        privateKey:
                                            "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                                        teamId: "YWQCXGJRJL",
                                    }
                                }]
                            }
                        }],
                }),
            ]
        });
    }
}