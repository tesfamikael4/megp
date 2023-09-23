import { BusinessProcessEntity } from 'src/bpm/business-process/entities/business-process';
import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskAssignmentEntity } from './task-assignment';
import { TaskHandlerEntity } from 'src/bpm/workflow-instances/entities/task-handler';

@Entity({ name: 'tasks' })
export class TaskEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ type: 'text', nullable: true })
  description: string;
  @Column({ name: 'business_process_id' })
  businessProcessId: string;
  @Column({ name: 'handler_type' })
  handlerType: string;
  @Column()
  type: string;
  @ManyToOne(
    () => BusinessProcessEntity,
    (businessProcess) => businessProcess.tasks,
    {
      orphanedRowAction: 'delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'business_process_id' })
  businessProcess: BusinessProcessEntity;
  @OneToMany(
    () => TaskAssignmentEntity,
    (taskAssignment) => taskAssignment.task,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  assignments: TaskAssignmentEntity[];

  @OneToMany(() => TaskHandlerEntity, (taskHandler) => taskHandler.task, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  taskHandlers: TaskHandlerEntity[];

  addAssignment(assignment: TaskAssignmentEntity) {
    if (!this.assignments) {
      this.assignments = [];
    }
    this.assignments.push(assignment);
  }
  updateAssignment(assignment: TaskAssignmentEntity) {
    const index = this.assignments.findIndex((a) => a.id === assignment.id);
    if (index !== -1) {
      this.assignments[index] = assignment;
    }
  }
  removeAssignment(assignment: TaskAssignmentEntity) {
    const index = this.assignments.findIndex((a) => a.id === assignment.id);
    if (index !== -1) {
      this.assignments.splice(index, 1);
    }
  }
}
