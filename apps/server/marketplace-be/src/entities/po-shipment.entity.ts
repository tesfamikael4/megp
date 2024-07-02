import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { InvoiceItem } from './invoice-item.entity';
import { OrgAudit } from 'megp-shared-be';
import { ReceivingNote } from './receiving-note.entity';
import { ItemShipment } from './item-shipment.entity';
import { POShipmentOrderStatus } from 'src/utils/enums';

@Entity({ name: 'po_shipments' })
export class POShipment extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  purchaseOrderId: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'jsonb' })
  deliveryLocation: any;

  @Column({ type: 'numeric', default: 0 })
  quantity: number;

  @Column({ nullable: true })
  uom: string;

  @Column({ type: 'timestamptz' })
  expectedDeliveryDate: Date;

  @Column({
    type: 'enum',
    enum: POShipmentOrderStatus,
    default: POShipmentOrderStatus.Draft,
  })
  status: POShipmentOrderStatus;

  @ManyToOne(
    () => PurchaseOrder,
    (purchaseOrder) => purchaseOrder.poShipments,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;

  @OneToMany(() => ItemShipment, (shipment) => shipment.poShipment)
  itemShipments: ItemShipment[];

  @OneToMany(() => ReceivingNote, (receivingNote) => receivingNote.poShipment)
  receivingNotes: ReceivingNote[];
}
