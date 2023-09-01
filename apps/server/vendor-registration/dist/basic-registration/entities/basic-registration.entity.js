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
exports.BasicRegistration = void 0;
const typeorm_1 = require("typeorm");
const security_question_entity_1 = require("./security-question.entity");
let BasicRegistration = class BasicRegistration {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], BasicRegistration.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BasicRegistration.prototype, "superTokenUserId", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BasicRegistration.prototype, "email", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BasicRegistration.prototype, "phoneNumber", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BasicRegistration.prototype, "alternativeEmail", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BasicRegistration.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BasicRegistration.prototype, "formOfBusiness", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BasicRegistration.prototype, "companyOrigin", void 0);
__decorate([
    (0, typeorm_1.Column)({ nullable: true }),
    __metadata("design:type", String)
], BasicRegistration.prototype, "district", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], BasicRegistration.prototype, "country", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => security_question_entity_1.SecurityQuestion, (securityQuestion) => securityQuestion.basicRegistration, {
        cascade: true,
        onDelete: "CASCADE"
    }),
    __metadata("design:type", Array)
], BasicRegistration.prototype, "securityQuestions", void 0);
BasicRegistration = __decorate([
    (0, typeorm_1.Entity)({ name: "basic_registrations" })
], BasicRegistration);
exports.BasicRegistration = BasicRegistration;
//# sourceMappingURL=basic-registration.entity.js.map