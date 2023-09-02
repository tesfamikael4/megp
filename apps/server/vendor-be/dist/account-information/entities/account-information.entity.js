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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AccountInformation = void 0;
const typeorm_1 = require("typeorm");
const basic_registration_entity_1 = require("./basic-registration.entity");
const security_question_entity_1 = require("./security-question.entity");
let AccountInformation = class AccountInformation {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], AccountInformation.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AccountInformation.prototype, "superTokenUserId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], AccountInformation.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AccountInformation.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], AccountInformation.prototype, "alternativeEmail", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => basic_registration_entity_1.BasicRegistration, (basicRegistration) => basicRegistration.accountInformation, {
        cascade: true,
        onDelete: "CASCADE"
    }),
    __metadata("design:type", basic_registration_entity_1.BasicRegistration)
], AccountInformation.prototype, "basicRegistration", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => security_question_entity_1.SecurityQuestion, (securityQuestion) => securityQuestion.accountInformation, {
        cascade: true,
        onDelete: "CASCADE"
    }),
    __metadata("design:type", Array)
], AccountInformation.prototype, "securityQuestions", void 0);
AccountInformation = __decorate([
    (0, typeorm_1.Entity)({ name: "account_informations" })
], AccountInformation);
exports.AccountInformation = AccountInformation;
//# sourceMappingURL=account-information.entity.js.map