"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupertokensService = void 0;
const common_1 = require("@nestjs/common");
const supertokens_node_1 = require("supertokens-node");
const session_1 = require("supertokens-node/recipe/session");
const thirdpartyemailpassword_1 = require("supertokens-node/recipe/thirdpartyemailpassword");
const dashboard_1 = require("supertokens-node/recipe/dashboard");
const config_interface_1 = require("../config.interface");
const organization_1 = require("../../../organization");
let SupertokensService = class SupertokensService {
    constructor(config, organizationService) {
        supertokens_node_1.default.init({
            appInfo: config.appInfo,
            supertokens: {
                connectionURI: config.connectionURI,
                apiKey: config.apiKey,
            },
            recipeList: [
                session_1.default.init({
                    exposeAccessTokenToFrontendInCookieBasedAuth: true,
                }),
                dashboard_1.default.init(),
                thirdpartyemailpassword_1.default.init({
                    signUpFeature: {
                        formFields: [
                            {
                                id: "email",
                                validate: async (value, tenantId) => {
                                    return undefined;
                                }
                            },
                            {
                                id: "password",
                                validate: async (value, tenantId) => {
                                    return undefined;
                                }
                            },
                            {
                                id: "firstName"
                            },
                            {
                                id: "lastName"
                            },
                            {
                                id: "organizationName"
                            },
                            {
                                id: "securityQuestions",
                                optional: true
                            },
                        ]
                    },
                    override: {
                        apis: (originalImplementation) => {
                            return Object.assign(Object.assign({}, originalImplementation), { emailPasswordSignUpPOST: async function (input) {
                                    if (originalImplementation.emailPasswordSignUpPOST === undefined) {
                                        throw Error("Should never come here");
                                    }
                                    let response = await originalImplementation.emailPasswordSignUpPOST(input);
                                    if (response.status === "OK") {
                                        let formFields = input.formFields;
                                        let user = response.user;
                                        await organizationService.registerOrganization(user, formFields);
                                    }
                                    return response;
                                } });
                        }
                    },
                    providers: [{
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
                                            privateKey: "-----BEGIN PRIVATE KEY-----\nMIGTAgEAMBMGByqGSM49AgEGCCqGSM49AwEHBHkwdwIBAQQgu8gXs+XYkqXD6Ala9Sf/iJXzhbwcoG5dMh1OonpdJUmgCgYIKoZIzj0DAQehRANCAASfrvlFbFCYqn3I2zeknYXLwtH30JuOKestDbSfZYxZNMqhF/OzdZFTV0zc5u5s3eN+oCWbnvl0hM+9IW0UlkdA\n-----END PRIVATE KEY-----",
                                            teamId: "YWQCXGJRJL",
                                        }
                                    }]
                            }
                        }],
                }),
            ]
        });
    }
};
SupertokensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(config_interface_1.ConfigInjectionToken)),
    __metadata("design:paramtypes", [Object, organization_1.OrganizationService])
], SupertokensService);
exports.SupertokensService = SupertokensService;
//# sourceMappingURL=supertokens.service.js.map