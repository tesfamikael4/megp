import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { ItemShipment } from './item-shipment.entity';
import { ItemBudgetSource } from './item-budget-source.entity';
import { ItemAttachment } from './item-attachment.entity';
import { ItemReceiver } from './item-receiver.entity';
import { VoucherDetail } from './voucher-detail.entity';
import { InvoiceItem } from './invoice-item.entity';
import { OrgAudit } from 'megp-shared-be';
import { POItemStatus } from 'src/utils/enums';
import { AcceptanceItem } from './acceptance-item.entity';
import { ReceivingItem } from './receiving-item.entity';

@Entity({ name: 'po_items' })
export class POItem extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  code: string;

  @Column({ type: 'uuid' })
  purchaseOrderId: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'numeric', default: 0 })
  quantity: number;

  @Column({ type: 'numeric', default: 0 })
  availableQuantity: number;

  @Column({ type: 'numeric', default: 0 })
  price: number;

  @Column({ type: 'numeric', default: 0 })
  lineTotal: number;

  @Column()
  uom: string;

  @Column()
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  specification: any;

  @Column({
    type: 'enum',
    enum: POItemStatus,
    default: POItemStatus.Draft,
  })
  status: POItemStatus;

  @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.poItems, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;

  @OneToMany(() => ItemShipment, (shipment) => shipment.poItem)
  itemShipments: ItemShipment[];

  @OneToMany(() => ItemBudgetSource, (budgetSource) => budgetSource.poItem)
  budgetSources: ItemBudgetSource[];

  @OneToMany(() => ItemAttachment, (attachment) => attachment.poItem)
  itemAttachments: ItemAttachment[];

  @OneToMany(() => ItemReceiver, (itemReceiver) => itemReceiver.poItem)
  itemReceivers: ItemReceiver[];

  @OneToMany(() => AcceptanceItem, (acceptanceItem) => acceptanceItem.poItem)
  acceptanceItems: AcceptanceItem[];

  @OneToMany(() => VoucherDetail, (voucherDetail) => voucherDetail.poItem)
  voucherDetails: VoucherDetail[];

  @OneToMany(() => InvoiceItem, (invoiceItems) => invoiceItems.poItem)
  invoiceItems: InvoiceItem[];

  @OneToMany(() => ReceivingItem, (receivingItem) => receivingItem.poItem)
  receivingItems: ReceivingItem[];

  @BeforeInsert()
  lineTotalCalculator() {
    this.lineTotal = this.quantity * this.price;

    if (!this.availableQuantity) {
      this.availableQuantity = this.quantity;
    }
  }
}
