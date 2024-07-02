import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { POItem } from './po-item.entity';
import { Audit } from 'megp-shared-be';
import { AcceptanceNote } from './acceptance-note.entity';
import { AcceptanceItemStatus } from 'src/utils/enums';

@Entity({ name: 'acceptance_items' })
export class AcceptanceItem extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  acceptanceNoteId: string;

  @Column({ type: 'uuid' })
  poItemId: string;

  @Column()
  orderedQuantity: number;

  @Column()
  deliveredQuantity: number;

  @Column({ default: 0, type: 'numeric' })
  unitPrice: number;

  @Column()
  uom: string;

  @Column({ nullable: true })
  remark: string;
  @Column({
    type: 'enum',
    enum: AcceptanceItemStatus,
    default: AcceptanceItemStatus.Draft,
  })
  status: AcceptanceItemStatus;

  @ManyToOne(
    () => AcceptanceNote,
    (acceptanceNote) => acceptanceNote.acceptanceItems,
  )
  @JoinColumn({ name: 'acceptanceNoteId' })
  acceptanceNote: AcceptanceNote;

  @ManyToOne(() => POItem, (poItem) => poItem.acceptanceItems)
  @JoinColumn({ name: 'poItemId' })
  poItem: POItem;
}
