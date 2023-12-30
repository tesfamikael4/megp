import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BusinessAreaEntity } from './business-area.entity';

@Entity({ name: 'invoice' })
export class InvoiceEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid', nullable: true })
  businessAreaId: string;
  @Column({ nullable: true })
  applicationNo: string;
  @Column()
  pricingId: string;
  @Column({ nullable: true })
  taskName: string;
  @Column({ type: 'uuid', nullable: true })
  taskId: string;
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
  // @Column({ nullable: true, unique: true })
  // reference: string
  @Column()
  remark: string;
  @Column({ nullable: true })
  attachment: string;
  @OneToOne(() => BusinessAreaEntity, (ba) => ba.invoice)
  @JoinColumn({ name: 'businessAreaId' })
  businessArea: BusinessAreaEntity
}
