import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkflowInstanceEntity } from './workflow-instance';
import { TaskEntity } from 'src/bpm/entities/task.entity';

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
  @Column({ name: 'remark', nullable: true })
  remark: string;
  @Column({ name: 'previous_handler_id', nullable: true })
  previousHandlerId: string;
  @ManyToOne(
    () => WorkflowInstanceEntity,
    (workflowInstance) => workflowInstance.taskTrackers,
  )
  @JoinColumn({ name: 'instance_id' })
  workflowInstance: WorkflowInstanceEntity;
  @ManyToOne(() => TaskEntity, (task) => task)
  @JoinColumn({ name: 'task_id' })
  task: TaskEntity;
}
