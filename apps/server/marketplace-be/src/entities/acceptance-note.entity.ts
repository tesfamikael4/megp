import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AcceptanceItem } from './acceptance-item.entity';
import { OrgAudit } from 'megp-shared-be';
import { AcceptanceReceive } from './acceptance-receive.entity';
import { AcceptanceNoteStatus } from 'src/utils/enums';
import { PurchaseOrder } from './purchase-order.entity';

@Entity({ name: 'acceptance_notes' })
export class AcceptanceNote extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  acceptanceNumber: string;

  @Column()
  purchaseOrderId: string;

  @Column({ type: 'timestamptz' })
  receivedDate: Date;

  @Column({ type: 'json' })
  deliveryLocation: any;

  @Column({ nullable: true })
  checkedById: string;

  @Column()
  checkedByName: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  orderNumber: string;

  @Column()
  vendorId: string;

  @Column()
  vendorName: string;

  @Column({
    type: 'enum',
    enum: AcceptanceNoteStatus,
    default: AcceptanceNoteStatus.Draft,
  })
  status: AcceptanceNoteStatus;

  @ManyToOne(
    () => PurchaseOrder,
    (purchaseOrder) => purchaseOrder.acceptanceNotes,
  )
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;

  @OneToMany(
    () => AcceptanceItem,
    (acceptanceItems) => acceptanceItems.acceptanceNote,
  )
  acceptanceItems: AcceptanceItem[];

  @OneToMany(
    () => AcceptanceReceive,
    (deliveryReceives) => deliveryReceives.acceptanceNote,
  )
  deliveryReceives: AcceptanceReceive[];
}
