import { OrgAudit } from 'megp-shared-be';
import {
  BeforeInsert,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { POItem } from './po-item.entity';
import { POAttachment } from './po-attachment.entity';
import { POTerm } from './po-term.entity';
import { Invoice } from './invoice.entity';
import { PaymentVoucher } from './payment-voucher.entity';
import { PurchaseOrderStatus } from 'src/utils/enums/purchase-order.enum';
import { AcceptanceNote } from './acceptance-note.entity';
import { POShipment } from './po-shipment.entity';
import { ReceivingNote } from './receiving-note.entity';

@Entity({ name: 'purchase_orders' })
export class PurchaseOrder extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  poReference: string;

  @Column()
  awardNoteId: string;

  @Column()
  procurementReference: string;

  @Column({ default: '1.0.0' })
  version: string;

  @Column()
  vendorId: string;

  @Column()
  vendorName: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  contactPerson: any;

  @Column({ nullable: true })
  bankAccount: string;

  @Column({ nullable: true })
  bankName: string;

  @Column({ type: 'timestamptz' })
  expectedDeliveryDate: Date;

  @Column({
    type: 'enum',
    enum: PurchaseOrderStatus,
    default: PurchaseOrderStatus.Draft,
  })
  status: PurchaseOrderStatus;

  @OneToMany(() => POItem, (poItem) => poItem.purchaseOrder)
  poItems: POItem[];

  @OneToMany(() => POAttachment, (poAttachment) => poAttachment.purchaseOrder)
  poAttachments: POAttachment[];

  @OneToMany(() => POTerm, (poTerm) => poTerm.purchaseOrder)
  poTerms: POTerm[];

  @OneToMany(() => POShipment, (poShipments) => poShipments.purchaseOrder)
  poShipments: POShipment[];

  @OneToMany(
    () => ReceivingNote,
    (receivingNotes) => receivingNotes.purchaseOrder,
  )
  receivingNotes: ReceivingNote[];

  @OneToMany(
    () => AcceptanceNote,
    (acceptanceNotes) => acceptanceNotes.purchaseOrder,
  )
  acceptanceNotes: AcceptanceNote[];

  @OneToMany(() => Invoice, (invoices) => invoices.purchaseOrder)
  invoices: Invoice[];

  @OneToMany(
    () => PaymentVoucher,
    (paymentVouchers) => paymentVouchers.purchaseOrder,
  )
  paymentVouchers: PaymentVoucher[];

  @BeforeInsert()
  generateRandomNumbers(): void {
    const randomNums = () => Math.floor(100000 + Math.random() * 900000);
    this.poReference = `PO-${randomNums()}`;
  }
}
