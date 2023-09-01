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
exports.EmployeeResponseDto = exports.UpdateEmployeeDto = exports.CreateEmployeeDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const employee_entity_1 = require("../entities/employee.entity");
class CreateEmployeeDto {
    static fromDto(employeeDto) {
        const employee = new employee_entity_1.Employee();
        if (!employeeDto) {
            return;
        }
        employee.username = employeeDto.username;
        employee.firstName = employeeDto.firstName;
        employee.lastName = employeeDto.lastName;
        employee.organizationId = employeeDto.organizationId;
        return employee;
    }
    static fromDtos(employeeDto) {
        return employeeDto === null || employeeDto === void 0 ? void 0 : employeeDto.map(employee => CreateEmployeeDto.fromDto(employee));
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "firstName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "lastName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEmployeeDto.prototype, "organizationId", void 0);
exports.CreateEmployeeDto = CreateEmployeeDto;
class UpdateEmployeeDto extends CreateEmployeeDto {
    static fromDto(employeeDto) {
        const employee = new employee_entity_1.Employee();
        if (!employeeDto) {
            return;
        }
        employee.id = employeeDto.id;
        employee.username = employeeDto.username;
        employee.firstName = employeeDto.firstName;
        employee.lastName = employeeDto.lastName;
        employee.organizationId = employeeDto.organizationId;
        return employee;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateEmployeeDto.prototype, "id", void 0);
exports.UpdateEmployeeDto = UpdateEmployeeDto;
class EmployeeResponseDto extends UpdateEmployeeDto {
    static toDto(employee) {
        const employeeDto = new EmployeeResponseDto();
        employeeDto.id = employee.id;
        employeeDto.username = employee.username;
        employeeDto.firstName = employee.firstName;
        employeeDto.lastName = employee.lastName;
        employeeDto.organizationId = employee.organizationId;
        return employeeDto;
    }
    static toDtos(employees) {
        return employees === null || employees === void 0 ? void 0 : employees.map(employee => EmployeeResponseDto.toDto(employee));
    }
}
exports.EmployeeResponseDto = EmployeeResponseDto;
//# sourceMappingURL=employee.dto.js.map