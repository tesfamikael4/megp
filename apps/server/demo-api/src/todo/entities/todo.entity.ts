import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
} from "typeorm";
import { TodoItem } from "./todo-item.entity";

@Entity({ name: "todoes" })
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(
    () => TodoItem,
    (todoItems) => todoItems.todo,
    {
      cascade: true,
      onDelete: "CASCADE"
    },
  )
  todoItems: TodoItem[];
}