import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { WorkflowInstanceEntity } from 'src/entities/workflow-instance.entity';
import { BpServiceEntity } from 'src/entities/bp-service.entity';
import { Audit } from 'src/shared/entities/audit.entity';
@Entity({ name: 'service_pricing' })
export class ServicePrice extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  serviceId: string;
  @Column({ name: 'businessArea', enum: ['Goods', 'Services', 'Works'] })
  businessArea: string;
  @Column({ type: 'decimal' })
  valueFrom: number;
  @Column({ type: 'decimal' })
  valueTo: number;
  @Column({ type: 'decimal', name: 'fee' })
  fee: number;
  @Column({ name: 'currency' })
  currency: string;
  @OneToMany(() => WorkflowInstanceEntity, (app) => app.price)
  workflowInstances: WorkflowInstanceEntity[];
  @ManyToOne(() => BpServiceEntity, (s) => s.prices)
  @JoinColumn({ name: 'serviceId' })
  service: BpServiceEntity;
}
