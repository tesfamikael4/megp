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
exports.TodoItemNewResponseDto = exports.UpdateTodoItemNewDto = exports.CreateTodoItemNewDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
const todo_item_new_entity_1 = require("../entities/todo-item-new.entity");
class CreateTodoItemNewDto {
    static fromDto(todoItemNewDto) {
        const todoItemNew = new todo_item_new_entity_1.TodoItemNew();
        if (!todoItemNewDto) {
            return;
        }
        todoItemNew.todoId = todoItemNewDto.todoId;
        todoItemNew.name = todoItemNewDto.name;
        return todoItemNew;
    }
    static fromDtos(todoItemNewDto) {
        return todoItemNewDto === null || todoItemNewDto === void 0 ? void 0 : todoItemNewDto.map(todoItemNew => CreateTodoItemNewDto.fromDto(todoItemNew));
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTodoItemNewDto.prototype, "todoId", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTodoItemNewDto.prototype, "name", void 0);
exports.CreateTodoItemNewDto = CreateTodoItemNewDto;
class UpdateTodoItemNewDto extends CreateTodoItemNewDto {
    static fromDto(todoItemNewDto) {
        const todoItemNew = new todo_item_new_entity_1.TodoItemNew();
        if (!todoItemNewDto) {
            return;
        }
        todoItemNew.id = todoItemNewDto.id;
        todoItemNew.todoId = todoItemNewDto.todoId;
        todoItemNew.name = todoItemNewDto.name;
        return todoItemNew;
    }
}
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], UpdateTodoItemNewDto.prototype, "id", void 0);
exports.UpdateTodoItemNewDto = UpdateTodoItemNewDto;
class TodoItemNewResponseDto extends UpdateTodoItemNewDto {
    static toDto(todoItemNew) {
        const todoItemNewDto = new TodoItemNewResponseDto();
        todoItemNewDto.id = todoItemNew.id;
        todoItemNewDto.todoId = todoItemNew.todoId;
        todoItemNewDto.name = todoItemNew.name;
        return todoItemNewDto;
    }
    static toDtos(todoItemNews) {
        return todoItemNews === null || todoItemNews === void 0 ? void 0 : todoItemNews.map(todoItemNew => TodoItemNewResponseDto.toDto(todoItemNew));
    }
}
exports.TodoItemNewResponseDto = TodoItemNewResponseDto;
//# sourceMappingURL=todo-item-new.dto.js.map