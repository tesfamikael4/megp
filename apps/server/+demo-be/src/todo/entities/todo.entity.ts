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

import { TodoItem } from './todo-item.entity';
import { TodoItemNew } from './todo-item-new.entity';

@Entity({ name: 'todoes' })
export class Todo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToOne(() => TodoItem, (todoItem) => todoItem.todo, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  todoItem: TodoItem;

  @OneToMany(() => TodoItemNew, (todoItemNew) => todoItemNew.todo, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  todoItemNews: TodoItemNew[];
}
