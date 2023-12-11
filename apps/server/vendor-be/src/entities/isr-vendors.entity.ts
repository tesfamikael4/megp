import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from 'src/shared/entities/audit.entity';
import { VendorsEntity } from './vendors.entity';
import { WorkflowInstanceEntity } from './workflow-instance.entity';
import { BusinessAreaEntity } from './business-area.entity';
@Entity({ name: 'isr_vendors' })
export class IsrVendorsEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  userId: string;
  @Column({ nullable: true })
  tinNumber: string;
  @Column({ default: 'Active' })
  status: string;
  @Column({ type: 'jsonb' })
  initial: JSON;
  @Column({ nullable: true })
  vendorId: string;
  @Column({ type: 'jsonb' })
  basic: JSON;
  @Column({ type: 'jsonb', nullable: true })
  address: JSON;
  @Column({ type: 'jsonb', nullable: true })
  contactPersons: JSON;
  @Column({ type: 'jsonb', nullable: true })
  businessSizeAndOwnership: JSON;
  @Column({ type: 'jsonb', nullable: true })
  shareHolders: JSON;
  @Column({ type: 'jsonb', nullable: true })
  beneficialOwnership: JSON;
  @Column({ type: 'jsonb', nullable: true })
  bankAccountDetails: JSON;
  @Column({ type: 'jsonb', nullable: true })
  areasOfBusinessInterest: JSON;
  @Column({ type: 'jsonb', nullable: true })
  invoice: JSON;
  @Column({ type: 'jsonb', nullable: true })
  supportingDocuments: JSON;
  @Column({ type: 'jsonb', nullable: true })
  paymentReceipt: JSON;
  @Column({ nullable: true })
  remark: string;

  @OneToOne(() => VendorsEntity)
  @JoinColumn({ name: 'vendorId' })
  vendor: VendorsEntity;
  @OneToMany(() => WorkflowInstanceEntity, (wf) => wf.isrVendor)
  instances: WorkflowInstanceEntity[];

  @OneToMany(() => BusinessAreaEntity, (businessArea) => businessArea.isrVendor)
  businessAreas: BusinessAreaEntity[];
}
