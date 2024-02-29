import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BusinessAreaEntity } from './business-area.entity';
import { BpServiceEntity } from './bp-service.entity';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'invoice' })
export class InvoiceEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid', nullable: true })
  businessAreaId: string;
  @Column({ nullable: true })
  applicationNo: string;
  @Column({ nullable: true })
  refNumber: string;
  @Column()
  pricingId: string;
  @Column({ nullable: true })
  serviceId: string;
  @Column()
  serviceName: string;
  @Column()
  payerName: string;
  @Column({ nullable: true })
  userId: string;
  @Column()
  payToAccNo: string;
  @Column()
  payToAccName: string;
  @Column()
  payToBank: string;
  @Column({ type: 'decimal' })
  amount: number;
  @Column()
  createdOn: Date;
  @Column()
  paymentStatus: string;
  @Column()
  remark: string;
  @Column({ nullable: true })
  attachment: string;
  @OneToOne(() => BusinessAreaEntity, (ba) => ba.invoice)
  @JoinColumn({ name: 'businessAreaId' })
  businessArea: BusinessAreaEntity;
  @ManyToOne(() => BpServiceEntity, (service) => service.invoices)
  service: BpServiceEntity;
}
