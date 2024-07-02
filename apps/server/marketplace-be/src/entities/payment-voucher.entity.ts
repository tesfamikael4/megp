import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Invoice } from './invoice.entity';
import { VoucherDetail } from './voucher-detail.entity';
import { PaymentVoucherStatus } from 'src/utils/enums/payment-voucher.enum';
import { Audit } from 'megp-shared-be';

@Entity({ name: 'payment_vouchers' })
export class PaymentVoucher extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  purchaseOrderId: string;

  @Column({ type: 'uuid' })
  invoiceId: string;

  @Column()
  voucherReferenceNumber: string;

  @Column()
  paidTo: string;

  @Column()
  paidBy: string;

  @Column()
  preparedBy: string;

  @Column({ type: 'timestamptz' })
  preparedDate: Date;

  @Column()
  paymentMethod: string;

  @Column({
    type: 'numeric',
    default: 0,
  })
  totalInvoiceAmount: number;

  @Column({
    type: 'numeric',
    default: 0,
  })
  netPayableAmount: number;

  @Column({
    type: 'numeric',
    default: 0,
  })
  taxRate: number;

  @Column({
    type: 'numeric',
    default: 0,
  })
  totalTaxAmount: number;

  @Column({
    type: 'numeric',
    default: 0,
  })
  totalDueAmount: number;

  @Column({ nullable: true })
  approvedById: string;

  @Column()
  approvedBy: string;

  @Column({ type: 'timestamptz' })
  paidDate: Date;

  @Column({
    type: 'enum',
    enum: PaymentVoucherStatus,
  })
  paymentStatus: PaymentVoucherStatus.Draft;

  @ManyToOne(
    () => PurchaseOrder,
    (purchaseOrder) => purchaseOrder.paymentVouchers,
  )
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;

  @ManyToOne(() => Invoice, (invoice) => invoice.paymentVouchers)
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;

  @OneToMany(
    () => VoucherDetail,
    (voucherDetail) => voucherDetail.paymentVoucher,
  )
  voucherDetails: VoucherDetail[];
}
