import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'invoice' })
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  instanceId: string;
  @Column({ nullable: true })
  applicationNo: string;
  @Column({ nullable: true })
  pricingId: string;
  @Column({ nullable: true })
  taskName: string;
  @Column({ type: 'uuid', nullable: true })
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
