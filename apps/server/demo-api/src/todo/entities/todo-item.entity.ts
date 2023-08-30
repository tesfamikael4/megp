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
} from "typeorm";

import { Todo } from './todo.entity';
 

@Entity({ name: "todo_items" })
export class TodoItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;
   
  @Column()
  todoId: string;

  @OneToOne(() => Todo, (todo) => todo.todoItem)
  @JoinColumn({ name: 'todoId' })
  public todo: Todo;
   
  @Column()
  name: string;
  
  }