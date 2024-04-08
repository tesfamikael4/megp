
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessProcessEntity, TaskHandlerEntity, TaskTrackerEntity } from '@entities';

import { IsrVendorsEntity } from './isr-vendors.entity';
import { BpServiceEntity } from './bp-service.entity';
import { Audit } from '@audit';
@Entity({ name: 'workflow_instances' })
export class WorkflowInstanceEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  applicationNumber: string;
  @Column({ nullable: true })
  requestorId: string;
  @Column({ nullable: true, type: 'jsonb' })
  user: object;
  @Column({ nullable: true, type: 'uuid' })
  userId: string;
  @Column({ default: 'Submitted' })
  status: string;
  @Column()
  bpId: string;
  @Column({ nullable: true, type: 'uuid' })
  serviceId: string;

  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  submittedAt: Date;
  @ManyToOne(() => BpServiceEntity, (ser) => ser.instances, {})
  @JoinColumn({ name: 'serviceId' })
  service: BpServiceEntity;

  @ManyToOne(() => BusinessProcessEntity, (bp) => bp.workflowInstances, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'bpId' })
  businessProcess: BusinessProcessEntity;
  @OneToOne(
    () => TaskHandlerEntity,
    (taskHandler) => taskHandler.workflowInstance,
    {
      cascade: true,
      // onDelete: 'CASCADE',
    },
  ) // specify inverse side as a second parameter
  taskHandler: TaskHandlerEntity;

  @OneToMany(
    () => TaskTrackerEntity,
    (taskTracker) => taskTracker.workflowInstance,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  taskTrackers: TaskTrackerEntity[];

  @ManyToOne(() => IsrVendorsEntity, (v) => v.instances)
  @JoinColumn({ name: 'requestorId' })
  isrVendor: IsrVendorsEntity;
}
