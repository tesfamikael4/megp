import { TodoItem } from './todo-item.entity';
import { TodoItemNew } from './todo-item-new.entity';
export declare class Todo {
  id: string;
  name: string;
  description: string;
  todoItem: TodoItem;
  todoItemNews: TodoItemNew[];
}
