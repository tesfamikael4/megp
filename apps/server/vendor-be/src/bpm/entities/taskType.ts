import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'taskTypes' })
export class TaskType {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
}
