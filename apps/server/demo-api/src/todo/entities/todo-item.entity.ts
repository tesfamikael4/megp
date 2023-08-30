import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn
} from "typeorm";
import { Todo } from "./todo.entity";

@Entity({ name: "todo_items" })
export class TodoItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;


  @Column()
  todoId: string;

  @ManyToOne(() => Todo, (todo) => todo.todoItems)
  @JoinColumn({ name: 'todoId' })
  public todo: Todo;
}