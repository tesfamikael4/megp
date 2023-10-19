import { BusinessProcessEntity } from 'src/bpm/entities/business-process';
import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaskHandlerEntity } from './task-handler';
import { TaskTrackerEntity } from './task-tracker';
import { VendorsEntity } from 'src/vendor-registration/entities/vendors.entity';
import { ServicePrice } from 'src/pricing/entities/service-price';

@Entity({ name: 'workflow_instances' })
export class WorkflowInstanceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  applicationNumber: string;
  @Column({ nullable: true })
  requestorId: string;
  @Column()
  status: string;
  @Column({ default: 'newRegistration' })
  key: string;
  @Column()
  bpId: string;
  @Column({ nullable: true })
  pricingId: string;
  @Column({ nullable: true })
  approvedAt: Date;
  @Column({ nullable: true })
  expireDate: Date;
  @Column({ default: 'Inactive' })
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
      //  cascade: true,
      onDelete: 'CASCADE',
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

  @ManyToOne(() => VendorsEntity, (v) => v.instances)
  @JoinColumn({ name: 'requestorId' })
  vendor: VendorsEntity;


}
