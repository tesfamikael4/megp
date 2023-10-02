import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkflowInstanceEntity } from './workflow-instance';
import { TaskEntity } from 'src/bpm/entities/task.entity';

@Entity({ name: 'task_handlers' })
export class TaskHandlerEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'task_id' })
  taskId: string;
  @Column({ name: 'instance_id' })
  instanceId: string;
  @Column({ name: 'data', type: 'jsonb', nullable: true })
  data: object;
  @Column({ name: 'assignment_status' })
  assignmentStatus: string;
  @Column({ name: 'previous_handler_id', nullable: true })
  previousHandlerId: string;
  @Column({ name: 'previous_handler_id' })
  @Column({ name: 'current_state', nullable: true })
  currentState: string;
  @OneToOne(
    () => WorkflowInstanceEntity,
    (workflowInstance) => workflowInstance.taskHandler,
  ) // specify inverse side as a second parameter
  @JoinColumn({ name: 'instance_id' })
  workflowInstance: WorkflowInstanceEntity;
  @ManyToOne(() => TaskEntity, (task) => task)
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;
}
