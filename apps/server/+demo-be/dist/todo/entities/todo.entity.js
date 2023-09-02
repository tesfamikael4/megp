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
exports.Todo = void 0;
const typeorm_1 = require("typeorm");
const todo_item_entity_1 = require("./todo-item.entity");
const todo_item_new_entity_1 = require("./todo-item-new.entity");
let Todo = class Todo {
};
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)('uuid'),
    __metadata("design:type", String)
], Todo.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Todo.prototype, "name", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], Todo.prototype, "description", void 0);
__decorate([
    (0, typeorm_1.OneToOne)(() => todo_item_entity_1.TodoItem, (todoItem) => todoItem.todo, {
        cascade: true,
        onDelete: "CASCADE"
    }),
    __metadata("design:type", todo_item_entity_1.TodoItem)
], Todo.prototype, "todoItem", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => todo_item_new_entity_1.TodoItemNew, (todoItemNew) => todoItemNew.todo, {
        cascade: true,
        onDelete: "CASCADE"
    }),
    __metadata("design:type", Array)
], Todo.prototype, "todoItemNews", void 0);
Todo = __decorate([
    (0, typeorm_1.Entity)({ name: "todoes" })
], Todo);
exports.Todo = Todo;
//# sourceMappingURL=todo.entity.js.map