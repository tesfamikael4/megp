import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskEntity } from './task.entity';
import { Audit } from '@audit';

@Entity({ name: 'task_assignments' })
export class TaskAssignmentEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  taskId: string;
  @Column()
  assigneeId: string;
  @Column({ nullable: true })
  assigneeName: string;
  @Column()
  assignmentType: string;
  @ManyToOne(() => TaskEntity, (task) => task.assignments, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;
}
