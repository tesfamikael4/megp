
import { BpServiceEntity, TaskEntity, WorkflowInstanceEntity } from '@entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from '@audit';

@Entity({ name: 'business_processes' })
export class BusinessProcessEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  serviceId: string;
  @Column({ type: 'jsonb' })
  workflow: object;
  @Column({ type: 'int' })
  version: number;
  @Column({ default: true })
  isActive: boolean;
  @Column({ nullable: true })
  organizationId: string;
  @Column({ nullable: true })
  organizationName: string;
  @ManyToOne(() => BpServiceEntity, (service) => service.businessProcesses, {
    orphanedRowAction: 'delete',
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'serviceId' })
  service: BpServiceEntity;

  @OneToMany(() => TaskEntity, (task) => task.businessProcess, {
    // cascade: true,
    onDelete: 'CASCADE',
  })
  tasks: TaskEntity[];

  @OneToMany(
    () => WorkflowInstanceEntity,
    (workflowInstances) => workflowInstances.businessProcess,
    {
      // cascade: true,
      onDelete: 'CASCADE',
    },
  )
  workflowInstances: WorkflowInstanceEntity[];
}
