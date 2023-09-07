import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationEntity } from './application.entity';

@Entity({ name: 'invoices' })
export class InvoiceEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'application_id', type: 'uuid' })
  applicationId: string;
  //PPDA or Vendor
  @Column({ name: 'amount', type: 'decimal' })
  amount: number;
  @Column({ name: 'paid_on' })
  paidOn: Date;
  //Paid| Pending
  @Column({ name: 'payment_status' })
  paymentStatus: string;
  @Column({ name: 'remark' })
  remark: string;

  @OneToOne(() => ApplicationEntity, (requisition) => requisition.invoice)
  @JoinColumn({ name: 'application_id' })
  application: ApplicationEntity;
}
