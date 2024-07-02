import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { PurchaseOrder } from './purchase-order.entity';

@Entity({ name: 'po_terms' })
export class POTerm extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  purchaseOrderId: string;

  @Column()
  warrantyPeriod: number;

  @Column({ type: 'numeric', default: 0 })
  liquidityDamage: number;

  @Column({ type: 'numeric', default: 0 })
  liquidityDamageLimit: number;

  @Column()
  paymentTerms: string;

  @Column({ type: 'json' })
  terms: any;

  @Column()
  deliveryPeriod: string;

  @Column()
  isPartialPaymentAllowed: boolean;

  @ManyToOne(() => PurchaseOrder, (purchaseOrder) => purchaseOrder.poTerms, {
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'purchaseOrderId' })
  purchaseOrder: PurchaseOrder;
}
