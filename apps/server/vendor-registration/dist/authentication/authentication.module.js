"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationModule = void 0;
const common_1 = require("@nestjs/common");
const auth_module_1 = require("./auth/auth.module");
let AuthenticationModule = class AuthenticationModule {
};
AuthenticationModule = __decorate([
    (0, common_1.Module)({
        imports: [
            auth_module_1.AuthModule.forRoot({
                connectionURI: "http://196.189.44.47:3567",
                apiKey: "ob0WLJ637sLR730GcEJJVFRcWNlc2PpN",
                appInfo: {
                    appName: "m-egp",
                    apiDomain: "http://196.189.44.47:3567",
                    websiteDomain: "http://196.189.44.47:3569",
                    apiBasePath: "/api/auth",
                    websiteBasePath: "/api/auth"
                },
            }),
        ],
        controllers: [],
        providers: [],
    })
], AuthenticationModule);
exports.AuthenticationModule = AuthenticationModule;
//# sourceMappingURL=authentication.module.js.map