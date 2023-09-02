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
exports.TodoController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const _api_data_1 = require("../shared/api-data");
const todo_dto_1 = require("./dto/todo.dto");
const todo_service_1 = require("./todo.service");
const todo_entity_1 = require("./entities/todo.entity");
const _collection_query_1 = require("../shared/collection-query");
const todo_item_dto_1 = require("./dto/todo-item.dto");
const todo_item_new_dto_1 = require("./dto/todo-item-new.dto");
let TodoController = class TodoController {
    constructor(todoService) {
        this.todoService = todoService;
    }
    async create(createTodoDto) {
        return await this.todoService.create(createTodoDto);
    }
    async findOne(id) {
        return await this.todoService.findOne(id);
    }
    async findAll(query) {
        return await this.todoService.findAll(query);
    }
    async update(id, updateTodoDto) {
        return await this.todoService.update(id, updateTodoDto);
    }
    async remove(id) {
        return await this.todoService.remove(id);
    }
    async addTodoItem(createTodoItemDto) {
        return await this.todoService.addTodoItem(createTodoItemDto);
    }
    async editTodoItem(id, createTodoItemDto) {
        return await this.todoService.updateTodoItem(id, createTodoItemDto);
    }
    async removeTodoItem(id) {
        return await this.todoService.removeTodoItem(id);
    }
    async addTodoItemNew(createTodoItemNewDto) {
        return await this.todoService.addTodoItemNew(createTodoItemNewDto);
    }
    async editTodoItemNew(id, createTodoItemNewDto) {
        return await this.todoService.updateTodoItemNew(id, createTodoItemNewDto);
    }
    async removeTodoItemNew(id) {
        return await this.todoService.removeTodoItemNew(id);
    }
};
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [todo_dto_1.CreateTodoDto]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "findOne", null);
__decorate([
    (0, common_1.Get)(),
    (0, _api_data_1.ApiPaginatedResponse)(todo_entity_1.Todo),
    (0, swagger_1.ApiOkResponse)({ type: todo_entity_1.Todo, isArray: false }),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [_collection_query_1.CollectionQuery]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "findAll", null);
__decorate([
    (0, common_1.Patch)(':id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, todo_dto_1.UpdateTodoDto]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)('add-todo-item'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [todo_item_dto_1.CreateTodoItemDto]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "addTodoItem", null);
__decorate([
    (0, common_1.Patch)('update-todo-item/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, todo_item_dto_1.UpdateTodoItemDto]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "editTodoItem", null);
__decorate([
    (0, common_1.Delete)('remove-todo-item/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "removeTodoItem", null);
__decorate([
    (0, common_1.Post)('add-todo-item-new'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [todo_item_new_dto_1.CreateTodoItemNewDto]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "addTodoItemNew", null);
__decorate([
    (0, common_1.Patch)('update-todo-item-new/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, todo_item_new_dto_1.UpdateTodoItemNewDto]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "editTodoItemNew", null);
__decorate([
    (0, common_1.Delete)('remove-todo-item-new/:id'),
    __param(0, (0, common_1.Param)('id', new common_1.ParseUUIDPipe({ errorHttpStatusCode: common_1.HttpStatus.NOT_ACCEPTABLE }))),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TodoController.prototype, "removeTodoItemNew", null);
TodoController = __decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.Controller)('todoes'),
    (0, swagger_1.ApiTags)('todoes'),
    __metadata("design:paramtypes", [todo_service_1.TodoService])
], TodoController);
exports.TodoController = TodoController;
//# sourceMappingURL=todo.controller.js.map