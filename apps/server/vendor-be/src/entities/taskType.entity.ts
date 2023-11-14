import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'task_types' })
export class TaskType {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
}
