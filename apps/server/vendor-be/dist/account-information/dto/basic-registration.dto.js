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
    static fromDto(basicRegistrationDto) {
        const basicRegistration = new basic_registration_entity_1.BasicRegistration();
        if (!basicRegistrationDto) {
            return;
        }
        basicRegistration.name = basicRegistrationDto.name;
        basicRegistration.formOfBusiness = basicRegistrationDto.formOfBusiness;
        basicRegistration.companyOrigin = basicRegistrationDto.companyOrigin;
        basicRegistration.district = basicRegistrationDto.district;
        basicRegistration.country = basicRegistrationDto.country;
        basicRegistration.accountInformationId = basicRegistrationDto.accountInformationId;
        return basicRegistration;
    }
    static fromDtos(basicRegistrationDto) {
        return basicRegistrationDto === null || basicRegistrationDto === void 0 ? void 0 : basicRegistrationDto.map(basicRegistration => CreateBasicRegistrationDto.fromDto(basicRegistration));
    }
}
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
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateBasicRegistrationDto.prototype, "accountInformationId", void 0);
exports.CreateBasicRegistrationDto = CreateBasicRegistrationDto;
class UpdateBasicRegistrationDto extends CreateBasicRegistrationDto {
    static fromDto(basicRegistrationDto) {
        const basicRegistration = new basic_registration_entity_1.BasicRegistration();
        if (!basicRegistrationDto) {
            return;
        }
        basicRegistration.id = basicRegistrationDto.id;
        basicRegistration.name = basicRegistrationDto.name;
        basicRegistration.formOfBusiness = basicRegistrationDto.formOfBusiness;
        basicRegistration.companyOrigin = basicRegistrationDto.companyOrigin;
        basicRegistration.district = basicRegistrationDto.district;
        basicRegistration.country = basicRegistrationDto.country;
        basicRegistration.accountInformationId = basicRegistrationDto.accountInformationId;
        return basicRegistration;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateBasicRegistrationDto.prototype, "id", void 0);
exports.UpdateBasicRegistrationDto = UpdateBasicRegistrationDto;
class BasicRegistrationResponseDto extends UpdateBasicRegistrationDto {
    static toDto(basicRegistration) {
        const basicRegistrationDto = new BasicRegistrationResponseDto();
        basicRegistrationDto.id = basicRegistration.id;
        basicRegistrationDto.name = basicRegistration.name;
        basicRegistrationDto.formOfBusiness = basicRegistration.formOfBusiness;
        basicRegistrationDto.companyOrigin = basicRegistration.companyOrigin;
        basicRegistrationDto.district = basicRegistration.district;
        basicRegistrationDto.country = basicRegistration.country;
        basicRegistrationDto.accountInformationId = basicRegistration.accountInformationId;
        return basicRegistrationDto;
    }
    static toDtos(basicRegistrations) {
        return basicRegistrations === null || basicRegistrations === void 0 ? void 0 : basicRegistrations.map(basicRegistration => BasicRegistrationResponseDto.toDto(basicRegistration));
    }
}
exports.BasicRegistrationResponseDto = BasicRegistrationResponseDto;
//# sourceMappingURL=basic-registration.dto.js.map