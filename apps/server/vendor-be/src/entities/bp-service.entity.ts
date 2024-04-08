
import { BusinessProcessEntity, ServicePrice } from '@entities';
import { Audit } from '@audit';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { WorkflowInstanceEntity } from './workflow-instance.entity';
import { BusinessAreaEntity } from './business-area.entity';
import { PreferentialTreatmentsEntity } from './preferential-treatment.entity';
import { InvoiceEntity } from './invoice.entity';
@Entity({ name: 'bp_services' })
export class BpServiceEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column({ unique: true })
  key: string;
  @Column({ nullable: true })
  description: string;
  @Column({ default: true })
  isActive: boolean;
  @OneToMany(() => WorkflowInstanceEntity, (wf) => wf.service, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  @OneToMany(() => InvoiceEntity, (inv) => inv.service, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  invoices: InvoiceEntity[];
  instances: WorkflowInstanceEntity[];
  @OneToMany(
    () => BusinessProcessEntity,
    (businessProcess) => businessProcess.service,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  businessProcesses: BusinessProcessEntity[];
  @OneToMany(() => ServicePrice, (price) => price.service, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  prices: ServicePrice[];

  @OneToMany(
    () => BusinessAreaEntity,
    (businessArea) => businessArea.BpService,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  businessAreas: BusinessAreaEntity[];

  @OneToMany(() => PreferentialTreatmentsEntity, (pt) => pt.service, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  prerentials: PreferentialTreatmentsEntity[];
}
