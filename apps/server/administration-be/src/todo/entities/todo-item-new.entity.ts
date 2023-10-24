import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  OneToOne,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Todo } from './todo.entity';

@Entity({ name: 'todo_item_news' })
export class TodoItemNew {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  todoId: string;

  @ManyToOne(() => Todo, (todo) => todo.todoItemNews)
  @JoinColumn({ name: 'todoId' })
  public todo: Todo;

  @Column()
  name: string;
}
