import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PaymentReceiptEntity } from './receipt-attachment';

@Entity({ name: 'invoices' })
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'instance_id', nullable: true, type: 'uuid' })
  instanceId: string;
  @Column({ name: 'applicationNo', nullable: true })
  applicationNo: string;
  @Column({ name: 'taskName', nullable: true })
  taskName: string;
  @Column({ name: 'taskId', nullable: true })
  taskId: string;
  @Column({ nullable: true })
  serviceName: string;
  @Column()
  payerName: string;
  @Column({ name: 'payer_account_id', nullable: true })
  payerAccountId: string;
  @Column()
  payToAccNo: string;
  @Column()
  payToAccName: string;
  @Column()
  payToBank: string;
  @Column({ name: 'amount', type: 'decimal' })
  amount: number;
  @Column({ name: 'createdOn' })
  createdOn: Date;
  //Paid| Pending
  @Column({ name: 'paymentStatus' })
  paymentStatus: string;
  @Column({ name: 'remark' })
  remark: string;
  @OneToOne(() => PaymentReceiptEntity)
  @JoinColumn()
  receipt: PaymentReceiptEntity;
}
