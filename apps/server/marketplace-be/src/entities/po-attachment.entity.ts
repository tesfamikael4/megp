import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';
import { Audit } from 'megp-shared-be';

@Entity({ name: 'po_attachments' })
export class POAttachment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  purchaseOrderId: string;

  @Column({ type: 'jsonb' })
  fileInfo: any;

  @Column()
  title: string;

  @ManyToOne(
    () => PurchaseOrder,
    (purchaseOrder) => purchaseOrder.poAttachments,
  )
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;
}
