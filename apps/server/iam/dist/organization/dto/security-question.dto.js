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
exports.SecurityQuestionResponseDto = exports.UpdateSecurityQuestionDto = exports.CreateSecurityQuestionDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const security_question_entity_1 = require("../entities/security-question.entity");
class CreateSecurityQuestionDto {
    static fromDto(securityQuestionDto) {
        const securityQuestion = new security_question_entity_1.SecurityQuestion();
        if (!securityQuestionDto) {
            return;
        }
        securityQuestion.question = securityQuestionDto.question;
        securityQuestion.answer = securityQuestionDto.answer;
        securityQuestion.employeeId = securityQuestionDto.employeeId;
        return securityQuestion;
    }
    static fromDtos(securityQuestionDto) {
        return securityQuestionDto === null || securityQuestionDto === void 0 ? void 0 : securityQuestionDto.map(securityQuestion => CreateSecurityQuestionDto.fromDto(securityQuestion));
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSecurityQuestionDto.prototype, "question", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSecurityQuestionDto.prototype, "answer", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateSecurityQuestionDto.prototype, "employeeId", void 0);
exports.CreateSecurityQuestionDto = CreateSecurityQuestionDto;
class UpdateSecurityQuestionDto extends CreateSecurityQuestionDto {
    static fromDto(securityQuestionDto) {
        const securityQuestion = new security_question_entity_1.SecurityQuestion();
        if (!securityQuestionDto) {
            return;
        }
        securityQuestion.id = securityQuestionDto.id;
        securityQuestion.question = securityQuestionDto.question;
        securityQuestion.answer = securityQuestionDto.answer;
        securityQuestion.employeeId = securityQuestionDto.employeeId;
        return securityQuestion;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateSecurityQuestionDto.prototype, "id", void 0);
exports.UpdateSecurityQuestionDto = UpdateSecurityQuestionDto;
class SecurityQuestionResponseDto extends UpdateSecurityQuestionDto {
    static toDto(securityQuestion) {
        const securityQuestionDto = new SecurityQuestionResponseDto();
        securityQuestionDto.id = securityQuestion.id;
        securityQuestionDto.question = securityQuestion.question;
        securityQuestionDto.answer = securityQuestion.answer;
        securityQuestionDto.employeeId = securityQuestion.employeeId;
        return securityQuestionDto;
    }
    static toDtos(securityQuestions) {
        return securityQuestions === null || securityQuestions === void 0 ? void 0 : securityQuestions.map(securityQuestion => SecurityQuestionResponseDto.toDto(securityQuestion));
    }
}
exports.SecurityQuestionResponseDto = SecurityQuestionResponseDto;
//# sourceMappingURL=security-question.dto.js.map