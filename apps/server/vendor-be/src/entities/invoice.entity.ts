import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BpServiceEntity } from './bp-service.entity';
import { Audit } from '@audit';

@Entity({ name: 'invoice' })
export class InvoiceEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true, unique: true })
  refNumber: string;
  @Column({ nullable: true })
  serviceId: string;
  @Column({ type: 'jsonb', nullable: true })
  paymentDetail: any;
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
  paymentStatus: string;
  @Column({ default: 'Manual' })
  paymentMethod: string;
  @Column()
  remark: string;
  @Column({ nullable: true })
  attachment: string;
  @Column()
  createdOn: Date;
  @ManyToOne(() => BpServiceEntity, (service) => service.invoices)
  service: BpServiceEntity;
}
