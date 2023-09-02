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
exports.SecurityQuestion = void 0;
const typeorm_1 = require("typeorm");
const basic_registration_entity_1 = require("./basic-registration.entity");
let SecurityQuestion = class SecurityQuestion {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], SecurityQuestion.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SecurityQuestion.prototype, "question", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SecurityQuestion.prototype, "answer", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], SecurityQuestion.prototype, "basicRegistrationId", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => basic_registration_entity_1.BasicRegistration, (basicRegistration) => basicRegistration.securityQuestions),
    (0, typeorm_1.JoinColumn)({ name: 'basicRegistrationId' }),
    __metadata("design:type", basic_registration_entity_1.BasicRegistration)
], SecurityQuestion.prototype, "basicRegistration", void 0);
SecurityQuestion = __decorate([
    (0, typeorm_1.Entity)({ name: "security_questions" })
], SecurityQuestion);
exports.SecurityQuestion = SecurityQuestion;
//# sourceMappingURL=security-question.entity.js.map