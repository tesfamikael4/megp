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
exports.BasicRegistrationResponseDto = exports.UpdateBasicRegistrationDto = exports.CreateBasicRegistrationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const basic_registration_entity_1 = require("../entities/basic-registration.entity");
class CreateBasicRegistrationDto {
    static fromDto(accountInformationDto) {
        const accountInformation = new basic_registration_entity_1.BasicRegistration();
        if (!accountInformationDto) {
            return;
        }
        accountInformation.email = accountInformationDto.email;
        accountInformation.phoneNumber = accountInformationDto.phoneNumber;
        accountInformation.name = accountInformationDto.name;
        accountInformation.formOfBusiness = accountInformationDto.formOfBusiness;
        accountInformation.companyOrigin = accountInformationDto.companyOrigin;
        accountInformation.district = accountInformationDto.district;
        accountInformation.country = accountInformationDto.country;
        return accountInformation;
    }
    static fromDtos(accountInformationDto) {
        return accountInformationDto === null || accountInformationDto === void 0 ? void 0 : accountInformationDto.map(accountInformation => CreateBasicRegistrationDto.fromDto(accountInformation));
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicRegistrationDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicRegistrationDto.prototype, "phoneNumber", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicRegistrationDto.prototype, "alternativeEmail", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicRegistrationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicRegistrationDto.prototype, "formOfBusiness", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicRegistrationDto.prototype, "companyOrigin", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicRegistrationDto.prototype, "district", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicRegistrationDto.prototype, "country", void 0);
exports.CreateBasicRegistrationDto = CreateBasicRegistrationDto;
class UpdateBasicRegistrationDto extends CreateBasicRegistrationDto {
    static fromDto(accountInformationDto) {
        const accountInformation = new basic_registration_entity_1.BasicRegistration();
        if (!accountInformationDto) {
            return;
        }
        accountInformation.id = accountInformationDto.id;
        accountInformation.superTokenUserId = accountInformationDto.superTokenUserId;
        accountInformation.email = accountInformationDto.email;
        accountInformation.phoneNumber = accountInformationDto.phoneNumber;
        accountInformation.alternativeEmail = accountInformationDto.alternativeEmail;
        accountInformation.name = accountInformationDto.name;
        accountInformation.formOfBusiness = accountInformationDto.formOfBusiness;
        accountInformation.companyOrigin = accountInformationDto.companyOrigin;
        accountInformation.district = accountInformationDto.district;
        accountInformation.country = accountInformationDto.country;
        return accountInformation;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBasicRegistrationDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBasicRegistrationDto.prototype, "superTokenUserId", void 0);
exports.UpdateBasicRegistrationDto = UpdateBasicRegistrationDto;
class BasicRegistrationResponseDto extends UpdateBasicRegistrationDto {
    static toDto(accountInformation) {
        const accountInformationDto = new BasicRegistrationResponseDto();
        accountInformationDto.id = accountInformation.id;
        accountInformationDto.superTokenUserId = accountInformation.superTokenUserId;
        accountInformationDto.email = accountInformation.email;
        accountInformationDto.phoneNumber = accountInformation.phoneNumber;
        accountInformationDto.alternativeEmail = accountInformation.alternativeEmail;
        return accountInformationDto;
    }
    static toDtos(accountInformations) {
        return accountInformations === null || accountInformations === void 0 ? void 0 : accountInformations.map(accountInformation => BasicRegistrationResponseDto.toDto(accountInformation));
    }
}
exports.BasicRegistrationResponseDto = BasicRegistrationResponseDto;
//# sourceMappingURL=basic-registration.dto.js.map