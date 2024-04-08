import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskAssignmentEntity, TaskHandlerEntity } from '@entities';

import { CreateTaskCheckListDto } from 'src/modules/bpm/dto/task-check-list.dto';
import { BusinessProcessEntity } from './business-process.entity';
import { Audit } from '@audit';
@Entity({ name: 'tasks' })
export class TaskEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ nullable: true })
  label: string;
  @Column({ type: 'text', nullable: true })
  description: string;
  @Column()
  bpId: string;
  @Column()
  handlerType: string;
  @Column({ default: 1 })
  orderBy: number;
  @Column()
  taskType: string;
  @Column({ type: 'jsonb', nullable: true })
  checkList: CreateTaskCheckListDto[];
  @ManyToOne(
    () => BusinessProcessEntity,
    (businessProcess) => businessProcess.tasks,
    {
      orphanedRowAction: 'delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'bpId' })
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
}
