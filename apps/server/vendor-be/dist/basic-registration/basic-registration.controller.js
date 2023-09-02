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
exports.BasicRegistrationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _api_data_1 = require("../shared/api-data");
const _collection_query_1 = require("../shared/collection-query");
const basic_registration_dto_1 = require("./dto/basic-registration.dto");
const security_question_dto_1 = require("./dto/security-question.dto");
const basic_registration_service_1 = require("./basic-registration.service");
const basic_registration_entity_1 = require("./entities/basic-registration.entity");
let BasicRegistrationController = class BasicRegistrationController {
    constructor(basicRegistrationService) {
        this.basicRegistrationService = basicRegistrationService;
    }
    async create(createBasicRegistrationDto) {
        return await this.basicRegistrationService.create(createBasicRegistrationDto);
    }
    async findOne(id) {
        return await this.basicRegistrationService.findOne(id);
    }
    async findAll(query) {
        return await this.basicRegistrationService.findAll(query);
    }
    async update(id, updateBasicRegistrationDto) {
        return await this.basicRegistrationService.update(id, updateBasicRegistrationDto);
    }
    async remove(id) {
        return await this.basicRegistrationService.remove(id);
    }
    async addSecurityQuestion(createSecurityQuestionDto) {
        return await this.basicRegistrationService.addSecurityQuestion(createSecurityQuestionDto);
    }
    async editSecurityQuestion(id, createSecurityQuestionDto) {
        return await this.basicRegistrationService.updateSecurityQuestion(id, createSecurityQuestionDto);
    }
    async removeSecurityQuestion(id) {
        return await this.basicRegistrationService.removeSecurityQuestion(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [basic_registration_dto_1.CreateBasicRegistrationDto]),
    __metadata("design:returntype", Promise)
], BasicRegistrationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BasicRegistrationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, _api_data_1.ApiPaginatedResponse)(basic_registration_entity_1.BasicRegistration),
    (0, swagger_1.ApiOkResponse)({ type: basic_registration_entity_1.BasicRegistration, isArray: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_collection_query_1.CollectionQuery]),
    __metadata("design:returntype", Promise)
], BasicRegistrationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, basic_registration_dto_1.UpdateBasicRegistrationDto]),
    __metadata("design:returntype", Promise)
], BasicRegistrationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BasicRegistrationController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('add-security-question'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [security_question_dto_1.CreateSecurityQuestionDto]),
    __metadata("design:returntype", Promise)
], BasicRegistrationController.prototype, "addSecurityQuestion", null);
__decorate([
    (0, common_1.Patch)('update-security-question/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, security_question_dto_1.UpdateSecurityQuestionDto]),
    __metadata("design:returntype", Promise)
], BasicRegistrationController.prototype, "editSecurityQuestion", null);
__decorate([
    (0, common_1.Delete)('remove-security-question/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BasicRegistrationController.prototype, "removeSecurityQuestion", null);
BasicRegistrationController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('basic-registrations'),
    (0, swagger_1.ApiTags)('basic-registrations'),
    __metadata("design:paramtypes", [basic_registration_service_1.BasicRegistrationService])
], BasicRegistrationController);
exports.BasicRegistrationController = BasicRegistrationController;
//# sourceMappingURL=basic-registration.controller.js.map