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
  @Column()
  taskId: string;
  @Column()
  instanceId: string;
  @Column({ type: 'jsonb', nullable: true })
  data: object;
  @Column()
  handledById: string;
  @Column()
  action: string;
  @Column({ nullable: true })
  remark: string;
  @Column({ nullable: true })
  previousHandlerId: string;
  @ManyToOne(
    () => WorkflowInstanceEntity,
    (workflowInstance) => workflowInstance.taskTrackers,
  )
  @JoinColumn({ name: 'instanceId' })
  workflowInstance: WorkflowInstanceEntity;
  @ManyToOne(() => TaskEntity, (task) => task)
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;
}
