import { Audit } from 'megp-shared-be';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payment_invoices' })
export class PaymentInvoice extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'enum', enum: ['ONLINE', 'OFFLINE'], default: 'ONLINE' })
  type: string;

  @Column()
  applicationKey: string;

  @Column()
  service: string;

  @Column()
  description: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ unique: true })
  invoiceReference: string;

  @Column({ unique: true, nullable: true })
  sessionId: string;

  @Column({ unique: true, nullable: true })
  bankReferenceNumber: string;

  @Column({ unique: true })
  orderId: string;

  @Column({ nullable: true })
  notificationUrl: string;

  @Column()
  callbackUrl: string;

  @Column()
  status: string;
}
