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
import { ServicePriceEntity } from 'src/pricing/entities/service-price.entity';

@Entity({ name: 'workflow_instances' })
export class WorkflowInstanceEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  applicationNumber: string;
  @Column({ nullable: true })
  requestorId: string;
  @Column()
  status: string;
  @Column()
  bpId: string;
  @Column({ nullable: true })
  pricingId: string;
  @Column({ nullable: true })
  approvedAt: string;
  @Column({ nullable: true })
  expireDate: string;
  @Column({ default: 'Inactive' })
  businessStatus: string; //active |inactive
  @ManyToOne(
    () => BusinessProcessEntity,
    (businessProcess) => businessProcess.workflowInstances,
    {
      orphanedRowAction: 'delete',
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'bpId' })
  businessProcess: BusinessProcessEntity;
  @OneToOne(
    () => TaskHandlerEntity,
    (taskHandler) => taskHandler.workflowInstance,
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

  @ManyToOne(() => ServicePriceEntity, (price) => price.workflowInstances, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'pricingId' })
  price: ServicePriceEntity;

  @ManyToOne(() => VendorsEntity, (v) => v.instances)
  @JoinColumn({ name: 'requestorId' })
  vendor: VendorsEntity;

  addTracker(taskTracker: TaskTrackerEntity) {
    if (!this.taskTrackers) {
      this.taskTrackers = [];
    }
    this.taskTrackers.push(taskTracker);
  }
  updateTracker(taskTracker: TaskTrackerEntity) {
    const index = this.taskTrackers.findIndex((a) => a.id === taskTracker.id);
    if (index !== -1) {
      this.taskTrackers[index] = taskTracker;
    }
  }
  removeTracker(taskTracker: TaskTrackerEntity) {
    const index = this.taskTrackers.findIndex((a) => a.id === taskTracker.id);
    if (index !== -1) {
      this.taskTrackers.splice(index, 1);
    }
  }
}
