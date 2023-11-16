import { BusinessProcessEntity } from 'src/entities/business-process.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServicePrice } from 'src/entities/service-price.entity';
import { TaskHandlerEntity } from 'src/entities/task-handler.entity';
import { TaskTrackerEntity } from 'src/entities/task-tracker.entity';
import { VendorsEntity } from './vendors.entity';
import { IsrVendorsEntity } from './isr-vendors.entity';
@Entity({ name: 'workflow_instances' })
export class WorkflowInstanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  applicationNumber: string;
  @Column({ nullable: true })
  requestorId: string;
  @Column({ default: 'Submitted' })
  status: string;
  @Column()
  bpId: string;
  @Column({ nullable: true })
  serviceId: string;
  @Column({ nullable: true })
  businessStatus: string; //active |inactive
  @Column({
    type: 'timestamptz',
    default: () => 'CURRENT_TIMESTAMP',
  })
  submittedAt: Date;

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

  @ManyToOne(() => ServicePrice, (price) => price.workflowInstances, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pricingId' })
  price: ServicePrice;

  @ManyToOne(() => IsrVendorsEntity, (v) => v.instances)
  @JoinColumn({ name: 'requestorId' })
  isrVendor: IsrVendorsEntity;
}
