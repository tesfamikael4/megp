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
exports.AccountInformationController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _api_data_1 = require("../shared/api-data");
const account_information_dto_1 = require("./dto/account-information.dto");
const account_information_service_1 = require("./account-information.service");
const account_information_entity_1 = require("./entities/account-information.entity");
const _collection_query_1 = require("../shared/collection-query");
const basic_registration_dto_1 = require("./dto/basic-registration.dto");
const security_question_dto_1 = require("./dto/security-question.dto");
let AccountInformationController = class AccountInformationController {
    constructor(accountInformationService) {
        this.accountInformationService = accountInformationService;
    }
    async create(createAccountInformationDto) {
        return await this.accountInformationService.create(createAccountInformationDto);
    }
    async findOne(id) {
        return await this.accountInformationService.findOne(id);
    }
    async findAll(query) {
        return await this.accountInformationService.findAll(query);
    }
    async update(id, updateAccountInformationDto) {
        return await this.accountInformationService.update(id, updateAccountInformationDto);
    }
    async remove(id) {
        return await this.accountInformationService.remove(id);
    }
    async addBasicRegistration(createBasicRegistrationDto) {
        return await this.accountInformationService.addBasicRegistration(createBasicRegistrationDto);
    }
    async editBasicRegistration(id, createBasicRegistrationDto) {
        return await this.accountInformationService.updateBasicRegistration(id, createBasicRegistrationDto);
    }
    async removeBasicRegistration(id) {
        return await this.accountInformationService.removeBasicRegistration(id);
    }
    async addSecurityQuestion(createSecurityQuestionDto) {
        return await this.accountInformationService.addSecurityQuestion(createSecurityQuestionDto);
    }
    async editSecurityQuestion(id, createSecurityQuestionDto) {
        return await this.accountInformationService.updateSecurityQuestion(id, createSecurityQuestionDto);
    }
    async removeSecurityQuestion(id) {
        return await this.accountInformationService.removeSecurityQuestion(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [account_information_dto_1.CreateAccountInformationDto]),
    __metadata("design:returntype", Promise)
], AccountInformationController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountInformationController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, _api_data_1.ApiPaginatedResponse)(account_information_entity_1.AccountInformation),
    (0, swagger_1.ApiOkResponse)({ type: account_information_entity_1.AccountInformation, isArray: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_collection_query_1.CollectionQuery]),
    __metadata("design:returntype", Promise)
], AccountInformationController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, account_information_dto_1.UpdateAccountInformationDto]),
    __metadata("design:returntype", Promise)
], AccountInformationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountInformationController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('add-basic-registration'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [basic_registration_dto_1.CreateBasicRegistrationDto]),
    __metadata("design:returntype", Promise)
], AccountInformationController.prototype, "addBasicRegistration", null);
__decorate([
    (0, common_1.Patch)('update-basic-registration/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, basic_registration_dto_1.UpdateBasicRegistrationDto]),
    __metadata("design:returntype", Promise)
], AccountInformationController.prototype, "editBasicRegistration", null);
__decorate([
    (0, common_1.Delete)('remove-basic-registration/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountInformationController.prototype, "removeBasicRegistration", null);
__decorate([
    (0, common_1.Post)('add-security-question'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [security_question_dto_1.CreateSecurityQuestionDto]),
    __metadata("design:returntype", Promise)
], AccountInformationController.prototype, "addSecurityQuestion", null);
__decorate([
    (0, common_1.Patch)('update-security-question/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, security_question_dto_1.UpdateSecurityQuestionDto]),
    __metadata("design:returntype", Promise)
], AccountInformationController.prototype, "editSecurityQuestion", null);
__decorate([
    (0, common_1.Delete)('remove-security-question/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AccountInformationController.prototype, "removeSecurityQuestion", null);
AccountInformationController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('account-informations'),
    (0, swagger_1.ApiTags)('account-informations'),
    __metadata("design:paramtypes", [account_information_service_1.AccountInformationService])
], AccountInformationController);
exports.AccountInformationController = AccountInformationController;
//# sourceMappingURL=account-information.controller.js.map