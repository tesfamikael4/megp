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
exports.UnitResponseDto = exports.UpdateUnitDto = exports.CreateUnitDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const unit_entity_1 = require("../entities/unit.entity");
class CreateUnitDto {
    static fromDto(unitDto) {
        const unit = new unit_entity_1.Unit();
        if (!unitDto) {
            return;
        }
        unit.name = unitDto.name;
        unit.parentId = unitDto.parentId;
        unit.organizationId = unitDto.organizationId;
        return unit;
    }
    static fromDtos(unitDto) {
        return unitDto === null || unitDto === void 0 ? void 0 : unitDto.map(unit => CreateUnitDto.fromDto(unit));
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "name", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "parentId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateUnitDto.prototype, "organizationId", void 0);
exports.CreateUnitDto = CreateUnitDto;
class UpdateUnitDto extends CreateUnitDto {
    static fromDto(unitDto) {
        const unit = new unit_entity_1.Unit();
        if (!unitDto) {
            return;
        }
        unit.id = unitDto.id;
        unit.name = unitDto.name;
        unit.parentId = unitDto.parentId;
        unit.organizationId = unitDto.organizationId;
        return unit;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateUnitDto.prototype, "id", void 0);
exports.UpdateUnitDto = UpdateUnitDto;
class UnitResponseDto extends UpdateUnitDto {
    static toDto(unit) {
        const unitDto = new UnitResponseDto();
        unitDto.id = unit.id;
        unitDto.name = unit.name;
        unitDto.parentId = unit.parentId;
        unitDto.organizationId = unit.organizationId;
        return unitDto;
    }
    static toDtos(units) {
        return units === null || units === void 0 ? void 0 : units.map(unit => UnitResponseDto.toDto(unit));
    }
}
exports.UnitResponseDto = UnitResponseDto;
//# sourceMappingURL=unit.dto.js.map