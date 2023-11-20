import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkflowInstanceEntity } from './workflow-instance.entity';
import { TaskEntity } from 'src/entities/task.entity';
import { TaskCheckListDto } from 'src/modules/bpm/dto/task-check-list.dto';
@Entity({ name: 'task_trackers' })
export class TaskTrackerEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  taskId: string;
  @Column()
  instanceId: string;
  @Column({ type: 'jsonb', nullable: true })
  data: object;
  @Column({ nullable: true })
  handlerUserId: string;
  @Column({ nullable: true, type: 'jsonb' })
  handlerUser: object;
  @Column({ nullable: true })
  pickedAt: Date;
  @Column()
  action: string;
  @Column({ nullable: true })
  remark: string;
  @Column({ nullable: true })
  previousHandlerId: string;
  @Column({ type: 'jsonb', nullable: true })
  checklists: TaskCheckListDto[];
  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  @Column({ nullable: true })
  executedAt: Date;
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
