import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'invoice' })
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'instance_id', nullable: true, type: 'uuid' })
  instanceId: string;
  @Column({ name: 'application_no', nullable: true })
  applicationNo: string;
  @Column({ name: 'task_name', nullable: true })
  taskName: string;
  @Column({ name: 'task_id', nullable: true })
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
  @Column({ type: 'decimal' })
  amount: number;
  @Column()
  createdOn: Date;
  @Column({ name: 'payment_status' })
  paymentStatus: string;
  @Column({ name: 'remark' })
  remark: string;
}
