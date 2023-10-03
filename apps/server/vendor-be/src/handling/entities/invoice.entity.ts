import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'invoices' })
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  instanceId: string;
  @Column()
  applicationNo: string;
  @Column()
  taskName: string;
  @Column({ type: 'uuid' })
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
  @Column({ type: 'decimal' })
  amount: number;
  @Column()
  createdOn: Date;
  @Column()
  paymentStatus: string;
  @Column()
  remark: string;
}
