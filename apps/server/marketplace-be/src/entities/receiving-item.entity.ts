import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { POItem } from './po-item.entity';
import { OrgAudit } from 'megp-shared-be';
import { ReceivedItemStatus } from 'src/utils/enums';
import { ReceivingNote } from './receiving-note.entity';

@Entity({ name: 'receiving_items' })
export class ReceivingItem extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  receivingNoteId: string;

  @Column({ type: 'uuid' })
  poItemId: string;

  @Column()
  referenceNumber: string;

  @Column({ type: 'numeric', default: 0 })
  quantity: number;

  @Column()
  itemName: string;

  @Column({ type: 'timestamptz' })
  receivedDate: Date;

  @Column()
  receivedBy: string;

  @Column({ nullable: true })
  deliveredBy: string;

  @Column()
  uom: string;

  @Column({ type: 'jsonb', nullable: true })
  specification: any;

  @Column({ default: 0 })
  quantityDelivered: number;

  @Column({ default: 0 })
  quantityAccepted: number;

  @Column({ default: 0 })
  quantityRejected: number;

  @Column({ nullable: true })
  rejectReason: string;

  @Column({ nullable: true })
  receiverNote: string;

  @Column({
    type: 'enum',
    enum: ReceivedItemStatus,
    default: ReceivedItemStatus.Draft,
  })
  status: ReceivedItemStatus;

  @ManyToOne(
    () => ReceivingNote,
    (receivingNote) => receivingNote.receivedItems,
    { onDelete: 'RESTRICT' },
  )
  @JoinColumn({ name: 'receivingNoteId' })
  receivingNote: ReceivingNote;

  @ManyToOne(() => POItem, (poItem) => poItem.receivingItems)
  @JoinColumn({ name: 'poItemId' })
  poItem: POItem;
}
