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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OrganizationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _api_data_1 = require("../shared/api-data");
const organization_dto_1 = require("./dto/organization.dto");
const organization_service_1 = require("./organization.service");
const organization_entity_1 = require("./entities/organization.entity");
const _collection_query_1 = require("../shared/collection-query");
const unit_dto_1 = require("./dto/unit.dto");
const employee_dto_1 = require("./dto/employee.dto");
let OrganizationController = class OrganizationController {
    constructor(organizationService) {
        this.organizationService = organizationService;
    }
    async create(createOrganizationDto) {
        return await this.organizationService.create(createOrganizationDto);
    }
    async findOne(id) {
        return await this.organizationService.findOne(id);
    }
    async findAll(query) {
        return await this.organizationService.findAll(query);
    }
    async update(id, updateOrganizationDto) {
        return await this.organizationService.update(id, updateOrganizationDto);
    }
    async remove(id) {
        return await this.organizationService.remove(id);
    }
    async addUnit(createUnitDto) {
        return await this.organizationService.addUnit(createUnitDto);
    }
    async editUnit(id, createUnitDto) {
        return await this.organizationService.updateUnit(id, createUnitDto);
    }
    async removeUnit(id) {
        return await this.organizationService.removeUnit(id);
    }
    async addEmployee(createEmployeeDto) {
        return await this.organizationService.addEmployee(createEmployeeDto);
    }
    async editEmployee(id, createEmployeeDto) {
        return await this.organizationService.updateEmployee(id, createEmployeeDto);
    }
    async removeEmployee(id) {
        return await this.organizationService.removeEmployee(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [organization_dto_1.CreateOrganizationDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, _api_data_1.ApiPaginatedResponse)(organization_entity_1.Organization),
    (0, swagger_1.ApiOkResponse)({ type: organization_entity_1.Organization, isArray: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_collection_query_1.CollectionQuery]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, organization_dto_1.UpdateOrganizationDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('add-unit'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [unit_dto_1.CreateUnitDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "addUnit", null);
__decorate([
    (0, common_1.Patch)('update-unit/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, unit_dto_1.UpdateUnitDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "editUnit", null);
__decorate([
    (0, common_1.Delete)('remove-unit/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "removeUnit", null);
__decorate([
    (0, common_1.Post)('add-employee'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [employee_dto_1.CreateEmployeeDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "addEmployee", null);
__decorate([
    (0, common_1.Patch)('update-employee/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, employee_dto_1.UpdateEmployeeDto]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "editEmployee", null);
__decorate([
    (0, common_1.Delete)('remove-employee/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], OrganizationController.prototype, "removeEmployee", null);
OrganizationController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('organizations'),
    (0, swagger_1.ApiTags)('organizations'),
    __metadata("design:paramtypes", [organization_service_1.OrganizationService])
], OrganizationController);
exports.OrganizationController = OrganizationController;
//# sourceMappingURL=organization.controller.js.map