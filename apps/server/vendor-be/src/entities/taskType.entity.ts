import { Audit } from '@audit';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'task_types' })
export class TaskType extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
}
