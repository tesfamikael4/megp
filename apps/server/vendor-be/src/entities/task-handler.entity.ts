import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkflowInstanceEntity } from './workflow-instance.entity';
import { TaskEntity } from '@entities';
import { Audit } from '@audit';
@Entity({ name: 'task_handlers' })
export class TaskHandlerEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  taskId: string;
  @Column({ type: 'uuid' })
  instanceId: string;
  @Column({ nullable: true })
  handlerUserId: string;
  @Column({ nullable: true, type: 'jsonb' })
  handlerUser: object;
  @Column({ nullable: true })
  previousHandlerId: string;
  @Column({ nullable: true })
  pickedAt: Date;
  @Column({ name: 'data', type: 'jsonb', nullable: true })
  data: object;
  @Column()
  currentState: string;
  @Column({ default: 'Unpicked' })
  assignmentStatus: string;
  @OneToOne(() => WorkflowInstanceEntity, (wfi) => wfi.taskHandler)
  @JoinColumn({ name: 'instanceId' })
  workflowInstance: WorkflowInstanceEntity;
  @ManyToOne(() => TaskEntity, (task) => task.taskHandlers)
  @JoinColumn({ name: 'taskId' })
  task: TaskEntity;
}
