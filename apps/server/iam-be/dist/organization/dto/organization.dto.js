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
exports.OrganizationResponseDto = exports.UpdateOrganizationDto = exports.CreateOrganizationDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const organization_entity_1 = require("../entities/organization.entity");
class CreateOrganizationDto {
    static fromDto(organizationDto) {
        const organization = new organization_entity_1.Organization();
        if (!organizationDto) {
            return;
        }
        organization.name = organizationDto.name;
        organization.code = organizationDto.code;
        organization.type = organizationDto.type;
        return organization;
    }
    static fromDtos(organizationDto) {
        return organizationDto === null || organizationDto === void 0 ? void 0 : organizationDto.map(organization => CreateOrganizationDto.fromDto(organization));
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "code", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateOrganizationDto.prototype, "type", void 0);
exports.CreateOrganizationDto = CreateOrganizationDto;
class UpdateOrganizationDto extends CreateOrganizationDto {
    static fromDto(organizationDto) {
        const organization = new organization_entity_1.Organization();
        if (!organizationDto) {
            return;
        }
        organization.id = organizationDto.id;
        organization.name = organizationDto.name;
        organization.code = organizationDto.code;
        organization.type = organizationDto.type;
        return organization;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateOrganizationDto.prototype, "id", void 0);
exports.UpdateOrganizationDto = UpdateOrganizationDto;
class OrganizationResponseDto extends UpdateOrganizationDto {
    static toDto(organization) {
        const organizationDto = new OrganizationResponseDto();
        organizationDto.id = organization.id;
        organizationDto.name = organization.name;
        organizationDto.code = organization.code;
        organizationDto.type = organization.type;
        return organizationDto;
    }
    static toDtos(organizations) {
        return organizations === null || organizations === void 0 ? void 0 : organizations.map(organization => OrganizationResponseDto.toDto(organization));
    }
}
exports.OrganizationResponseDto = OrganizationResponseDto;
//# sourceMappingURL=organization.dto.js.map