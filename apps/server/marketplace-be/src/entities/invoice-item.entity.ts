import { OrgAudit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { POItem } from './po-item.entity';

@Entity({ name: 'invoice_items' })
export class InvoiceItem extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  itemShipmentId: string;

  @Column()
  poItemId: string;

  @Column()
  itemName: string;

  @Column()
  itemCode: string;

  @Column()
  shipTo: string;

  @Column()
  receivedQuantity: number;

  @Column()
  payableQuantity: number;

  @Column({ type: 'numeric' })
  unitPrice: number;

  @Column({ type: 'numeric' })
  totalPrice: number;

  @Column({ type: 'boolean' })
  isTaxIncluded: boolean;

  @ManyToOne(() => POItem, (poItem) => poItem.invoiceItems)
  @JoinColumn({ name: 'poItemId' })
  poItem: POItem;
}
