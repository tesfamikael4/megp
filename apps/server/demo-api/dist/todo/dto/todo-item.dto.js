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
exports.TodoItemResponseDto = exports.UpdateTodoItemDto = exports.CreateTodoItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const todo_item_entity_1 = require("../entities/todo-item.entity");
class CreateTodoItemDto {
    static fromDto(todoItemDto) {
        const todoItem = new todo_item_entity_1.TodoItem();
        if (!todoItemDto) {
            return;
        }
        todoItem.todoId = todoItemDto.todoId;
        todoItem.name = todoItemDto.name;
        return todoItem;
    }
    static fromDtos(todoItemDto) {
        return todoItemDto === null || todoItemDto === void 0 ? void 0 : todoItemDto.map(todoItem => CreateTodoItemDto.fromDto(todoItem));
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTodoItemDto.prototype, "todoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTodoItemDto.prototype, "name", void 0);
exports.CreateTodoItemDto = CreateTodoItemDto;
class UpdateTodoItemDto extends CreateTodoItemDto {
    static fromDto(todoItemDto) {
        const todoItem = new todo_item_entity_1.TodoItem();
        if (!todoItemDto) {
            return;
        }
        todoItem.id = todoItemDto.id;
        todoItem.todoId = todoItemDto.todoId;
        todoItem.name = todoItemDto.name;
        return todoItem;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTodoItemDto.prototype, "id", void 0);
exports.UpdateTodoItemDto = UpdateTodoItemDto;
class TodoItemResponseDto extends UpdateTodoItemDto {
    static toDto(todoItem) {
        const todoItemDto = new TodoItemResponseDto();
        todoItemDto.id = todoItem.id;
        todoItemDto.todoId = todoItem.todoId;
        todoItemDto.name = todoItem.name;
        return todoItemDto;
    }
    static toDtos(todoItems) {
        return todoItems === null || todoItems === void 0 ? void 0 : todoItems.map(todoItem => TodoItemResponseDto.toDto(todoItem));
    }
}
exports.TodoItemResponseDto = TodoItemResponseDto;
//# sourceMappingURL=todo-item.dto.js.map