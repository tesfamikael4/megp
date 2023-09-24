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
  @Column({ name: 'instance_id', type: 'uuid' })
  instanceId: string;
  @Column({ name: 'applicationNo' })
  applicationNo: string;
  @Column({ name: 'taskName' })
  taskName: string;
  @Column({ name: 'taskId' })
  taskId: string;
  @Column()
  serviceName: string;
  @Column()
  payerName: string;
  @Column()
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
  @OneToOne(() => PaymentReceiptEntity, (rec) => rec.invoice)
  receipt: PaymentReceiptEntity;
}
