import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskEntity } from './task.entity';

@Entity({ name: 'task_assignments' })
export class TaskAssignmentEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'task_id' })
  taskId: string;
  @Column({ name: 'assignee_id' })
  assigneeId: string;
  @Column({ name: 'assignee_name', nullable: true })
  assigneeName: string;
  @Column({ name: 'assignee_type' })
  assignmentType: string;
  @ManyToOne(() => TaskEntity, (task) => task.taskAssignments, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;
}
