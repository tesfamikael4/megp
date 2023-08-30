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
let SupertokensService = exports.SupertokensService = class SupertokensService {
    constructor(config) {
        this.config = config;
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
                    override: {
                        functions: (originalImplementation) => {
                            return Object.assign(Object.assign({}, originalImplementation), { emailPasswordSignUp: async function (input) {
                                    let response = await originalImplementation.emailPasswordSignUp(input);
                                    if (response.status === "OK") {
                                    }
                                    return response;
                                }, emailPasswordSignIn: async function (input) {
                                    let response = await originalImplementation.emailPasswordSignIn(input);
                                    if (response.status === "OK") {
                                    }
                                    return response;
                                }, thirdPartySignInUp: async function (input) {
                                    let response = await originalImplementation.thirdPartySignInUp(input);
                                    if (response.status === "OK") {
                                        let accessToken = response.oAuthTokens["access_token"];
                                        let firstName = response.rawUserInfoFromProvider.fromUserInfoAPI["first_name"];
                                        if (response.createdNewUser) {
                                        }
                                        else {
                                        }
                                    }
                                    return response;
                                } });
                        }
                    }
                }),
            ]
        });
    }
};
exports.SupertokensService = SupertokensService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(config_interface_1.ConfigInjectionToken)),
    __metadata("design:paramtypes", [Object])
], SupertokensService);
//# sourceMappingURL=supertokens.service.js.map