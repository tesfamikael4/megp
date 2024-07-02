import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { POItem } from './po-item.entity';
import { PaymentVoucher } from './payment-voucher.entity';
import { Audit } from 'megp-shared-be';

@Entity({ name: 'voucher_details' })
export class VoucherDetail extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  poItemId: string;

  @Column({ type: 'uuid' })
  paymentVoucherId: string;

  @Column()
  description: string;

  @Column()
  quantity: number;

  @Column({ type: 'decimal', scale: 2 })
  unitPrice: number;

  @Column({ type: 'decimal', scale: 2 })
  totalPrice: number;

  @Column({ type: 'decimal', scale: 2 })
  deduction: number;

  @Column({ type: 'decimal', scale: 2 })
  taxAmount: number;

  @Column({ type: 'decimal', scale: 2 })
  dueAmount: number;

  @ManyToOne(() => POItem, (poItem) => poItem.voucherDetails)
  poItem: POItem;

  @ManyToOne(
    () => PaymentVoucher,
    (paymentVoucher) => paymentVoucher.voucherDetails,
  )
  paymentVoucher: PaymentVoucher;
}
