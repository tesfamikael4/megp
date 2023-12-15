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
  initial: any;
  @Column({ nullable: true })
  vendorId: string;
  @Column({ type: 'jsonb' })
  basic: any;
  @Column({ type: 'jsonb', nullable: true })
  address: any;
  @Column({ type: 'jsonb', nullable: true })
  contactPersons: any;
  @Column({ type: 'jsonb', nullable: true })
  businessSizeAndOwnership: any;
  @Column({ type: 'jsonb', nullable: true })
  shareHolders: any;
  @Column({ type: 'jsonb', nullable: true })
  beneficialOwnership: any;
  @Column({ type: 'jsonb', nullable: true })
  bankAccountDetails: any;
  @Column({ type: 'jsonb', nullable: true })
  areasOfBusinessInterest: any;
  @Column({ type: 'jsonb', nullable: true })
  invoice: any;
  @Column({ type: 'jsonb', nullable: true })
  supportingDocuments: any;
  @Column({ type: 'jsonb', nullable: true })
  paymentReceipt: any;
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
