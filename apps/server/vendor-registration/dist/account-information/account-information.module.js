"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountInformationModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const account_information_controller_1 = require("./account-information.controller");
const account_information_entity_1 = require("./entities/account-information.entity");
const account_information_service_1 = require("./account-information.service");
const basic_registration_entity_1 = require("./entities/basic-registration.entity");
const security_question_entity_1 = require("./entities/security-question.entity");
let AccountInformationModule = class AccountInformationModule {
};
AccountInformationModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([account_information_entity_1.AccountInformation, basic_registration_entity_1.BasicRegistration, security_question_entity_1.SecurityQuestion])],
        providers: [account_information_service_1.AccountInformationService],
        controllers: [account_information_controller_1.AccountInformationController],
        exports: [account_information_service_1.AccountInformationService],
    })
], AccountInformationModule);
exports.AccountInformationModule = AccountInformationModule;
//# sourceMappingURL=account-information.module.js.map