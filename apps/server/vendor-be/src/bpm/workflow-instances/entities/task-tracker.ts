import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkflowInstanceEntity } from './workflow-instance';
import { TaskEntity } from 'src/bpm/tasks/entities/task.entity';

@Entity({ name: 'task_trackers' })
export class TaskTrackerEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'task_id' })
  taskId: string;
  @Column({ name: 'instance_id' })
  instanceId: string;
  @Column({ name: 'data', type: 'jsonb', nullable: true })
  data: object;
  @Column({ name: 'handled_by_id' })
  handledById: string;
  @Column({ name: 'action' })
  action: string;
  @Column({ name: 'previous_handler_id' })
  previousHandlerId: string;
  @ManyToOne(
    () => WorkflowInstanceEntity,
    (workflowInstance) => workflowInstance.taskHandlers,
  )
  @JoinColumn({ name: 'instance_id' })
  workflowInstance: WorkflowInstanceEntity;
  @ManyToOne(() => TaskEntity, (task) => task)
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;
}
