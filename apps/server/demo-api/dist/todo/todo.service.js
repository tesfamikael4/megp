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
exports.TodoService = void 0;
const typeorm_1 = require("@nestjs/typeorm");
const common_1 = require("@nestjs/common");
const typeorm_2 = require("typeorm");
const todo_entity_1 = require("./entities/todo.entity");
const _collection_query_1 = require("../shared/collection-query");
const todo_dto_1 = require("./dto/todo.dto");
const _api_data_1 = require("../shared/api-data");
const todo_item_entity_1 = require("./entities/todo-item.entity");
const todo_item_dto_1 = require("./dto/todo-item.dto");
const todo_item_new_entity_1 = require("./entities/todo-item-new.entity");
const todo_item_new_dto_1 = require("./dto/todo-item-new.dto");
let TodoService = class TodoService {
    constructor(repository, todoItemRepository, todoItemNewRepository) {
        this.repository = repository;
        this.todoItemRepository = todoItemRepository;
        this.todoItemNewRepository = todoItemNewRepository;
    }
    async create(todo) {
        try {
            const todoEntity = todo_dto_1.CreateTodoDto.fromDto(todo);
            await this.repository.save(todoEntity);
            return todo_dto_1.TodoResponseDto.toDto(todoEntity);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async update(id, todo) {
        try {
            todo.id = id;
            const todoEntity = todo_dto_1.UpdateTodoDto.fromDto(todo);
            await this.repository.update({ id: todo.id }, todoEntity);
            return todo_dto_1.TodoResponseDto.toDto(todoEntity);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findAll(query) {
        try {
            const dataQuery = _collection_query_1.QueryConstructor.constructQuery(this.repository, query);
            const response = new _api_data_1.DataResponseFormat();
            if (query.count) {
                response.total = await dataQuery.getCount();
            }
            else {
                const [result, total] = await dataQuery.getManyAndCount();
                response.total = total;
                response.items = todo_dto_1.TodoResponseDto.toDtos(result);
            }
            return response;
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async findOne(id) {
        try {
            const todoEntity = await this.repository.findOne({ where: { id } });
            return todo_dto_1.TodoResponseDto.toDto(todoEntity);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async remove(id) {
        try {
            await this.repository.delete({ id: id });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async addTodoItem(todoItem) {
        try {
            const todoItemEntity = todo_item_dto_1.CreateTodoItemDto.fromDto(todoItem);
            await this.todoItemRepository.save(todoItemEntity);
            return todo_item_dto_1.TodoItemResponseDto.toDto(todoItemEntity);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateTodoItem(id, todoItem) {
        try {
            todoItem.id = id;
            const todoItemEntity = todo_item_dto_1.UpdateTodoItemDto.fromDto(todoItem);
            await this.todoItemRepository.update({ id: todoItem.id }, todoItemEntity);
            return todo_item_dto_1.TodoItemResponseDto.toDto(todoItemEntity);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async removeTodoItem(id) {
        try {
            await this.todoItemRepository.delete({ id: id });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async addTodoItemNew(todoItemNew) {
        try {
            const todoItemNewEntity = todo_item_new_dto_1.CreateTodoItemNewDto.fromDto(todoItemNew);
            await this.todoItemNewRepository.save(todoItemNewEntity);
            return todo_item_new_dto_1.TodoItemNewResponseDto.toDto(todoItemNewEntity);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateTodoItemNew(id, todoItemNew) {
        try {
            todoItemNew.id = id;
            const todoItemNewEntity = todo_item_new_dto_1.UpdateTodoItemNewDto.fromDto(todoItemNew);
            await this.todoItemNewRepository.update({ id: todoItemNew.id }, todoItemNewEntity);
            return todo_item_new_dto_1.TodoItemNewResponseDto.toDto(todoItemNewEntity);
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async removeTodoItemNew(id) {
        try {
            await this.todoItemNewRepository.delete({ id: id });
        }
        catch (error) {
            throw new common_1.HttpException(error, common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
TodoService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(todo_entity_1.Todo)),
    __param(1, (0, typeorm_1.InjectRepository)(todo_item_entity_1.TodoItem)),
    __param(2, (0, typeorm_1.InjectRepository)(todo_item_new_entity_1.TodoItemNew)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], TodoService);
exports.TodoService = TodoService;
//# sourceMappingURL=todo.service.js.map