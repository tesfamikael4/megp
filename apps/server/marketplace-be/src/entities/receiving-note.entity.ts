import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrgAudit } from 'megp-shared-be';
import { AcceptanceReceive } from './acceptance-receive.entity';
import { ReceivingItem } from './receiving-item.entity';
import { ReceivingAttachment } from './receiving-attachment.entity';
import { POShipment } from './po-shipment.entity';
import { ReceivingNoteStatus } from 'src/utils/enums';
import { PurchaseOrder } from './purchase-order.entity';

@Entity({ name: 'receiving_notes' })
export class ReceivingNote extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  poShipmentId: string;

  @Column({ type: 'uuid' })
  purchaseOrderId: string;

  @Column()
  orderNumber: string;

  @Column({ type: 'boolean' })
  isCompleted: boolean;

  @Column()
  totalQuantity: number;

  @Column()
  receivedQuantity: number;

  @Column()
  description: string;

  @Column()
  vendorId: string;

  @Column()
  vendorName: string;

  @Column({
    type: 'enum',
    enum: ReceivingNoteStatus,
    default: ReceivingNoteStatus.Draft,
  })
  status: ReceivingNoteStatus;

  @ManyToOne(() => POShipment, (poShipment) => poShipment.receivingNotes, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'poShipmentId' })
  poShipment: POShipment[];

  @ManyToOne(
    () => PurchaseOrder,
    (purchaseOrder) => purchaseOrder.receivingNotes,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder[];

  @OneToMany(
    () => ReceivingItem,
    (receivedItems) => receivedItems.receivingNote,
  )
  receivedItems: ReceivingItem[];

  @OneToMany(
    () => ReceivingAttachment,
    (receivingAttachments) => receivingAttachments.receivingNote,
  )
  receivingAttachments: ReceivingAttachment[];

  @OneToMany(
    () => AcceptanceReceive,
    (acceptanceReceives) => acceptanceReceives.receivingNote,
  )
  acceptanceReceives: AcceptanceReceive[];
}
