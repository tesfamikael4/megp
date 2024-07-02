import { OrgAudit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { PaymentVoucher } from './payment-voucher.entity';
import { InvoiceAttachment } from './invoice-attachment.entity';
import { InvoiceStatus } from 'src/utils/enums/invoice.enum';

@Entity({ name: 'invoices' })
export class Invoice extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  purchaseOrderId: string;

  @Column({ type: 'uuid' })
  itemReceiveId: string;

  @Column()
  supplierName: string;

  @Column()
  taxId: number;

  @Column()
  remitTo: string;

  @Column()
  bankName: string;

  @Column()
  remitToBankAccount: number;

  @Column()
  organizationName: string;

  @Column()
  poReference: string;

  @Column()
  invoiceNumber: number;

  @Column()
  invoiceType: string;

  @Column()
  invoiceDate: Date;

  @Column()
  currency: string;

  @Column({
    type: 'enum',
    enum: InvoiceStatus,
    default: InvoiceStatus.Draft,
  })
  status: InvoiceStatus;

  @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.invoices, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;

  @OneToMany(() => PaymentVoucher, (paymentVoucher) => paymentVoucher.invoice)
  paymentVouchers: PaymentVoucher[];

  @OneToMany(
    () => InvoiceAttachment,
    (invoiceAttachment) => invoiceAttachment.invoice,
  )
  attachments: InvoiceAttachment[];
}
