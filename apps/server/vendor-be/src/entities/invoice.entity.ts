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
  @Column({ nullable: true })
  refNumber: string;
  @Column({ nullable: true })
  serviceId: string;
  @Column({ type: 'jsonb', nullable: true })
  paymentDetail: any
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
  @ManyToOne(() => BpServiceEntity, (service) => service.invoices)
  service: BpServiceEntity;
}
