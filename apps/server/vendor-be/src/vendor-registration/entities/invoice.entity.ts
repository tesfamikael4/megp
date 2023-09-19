import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { VendorsEntity } from './vendors.entity';
@Entity({ name: 'invoices' })
export class InvoiceEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'vendor_id', type: 'uuid' })
  applicationId: string;
  //PPDA or Vendor
  @Column({ name: 'amount', type: 'decimal' })
  amount: number;
  @Column({ name: 'paid_on' })
  paidOn: Date;
  //Paid| Pending
  @Column({ name: 'payment_status' })
  paymentStatus: string;
  @Column({ name: 'remark' })
  remark: string;
  /*
    @ManyToOne(() => VendorsEntity, (vendor) => vendor.invoices)
    @JoinColumn({ name: 'vendor_id' })
    vendor: VendorsEntity;
    */
}
