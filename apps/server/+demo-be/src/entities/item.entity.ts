import { Audit } from 'src/shared/entities';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Todo } from './todo.entity';

@Entity({ name: 'items' })
export class Item extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'jsonb' })
  descriptionJson: any;

  @Column()
  todoId: string;

  @ManyToOne(() => Todo, (account) => account.items)
  @JoinColumn({ name: 'todoId' })
  todo: Todo[];
}
