import { Audit } from 'megp-shared-be';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'payment_invoices' })
export class PaymentInvoice extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  applicationKey: string;

  @Column({ type: 'decimal', precision: 14, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column({ unique: true })
  invoiceReference: string;

  @Column({ unique: true })
  sessionId: string;

  @Column({ unique: true })
  orderId: string;

  @Column()
  notificationUrl: string;

  @Column()
  callbackUrl: string;

  @Column()
  status: string;
}
