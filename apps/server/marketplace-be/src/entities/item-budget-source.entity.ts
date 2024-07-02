import {
  BeforeInsert,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { POItem } from './po-item.entity';
import { Audit } from 'megp-shared-be';

@Entity({ name: 'item_budget_sources' })
export class ItemBudgetSource extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  poItemId: string;

  @Column({ type: 'jsonb' })
  chartOfAccount: any;

  @Column({ type: 'numeric', default: 0 })
  quantity: number;

  @Column({ type: 'numeric', default: 0 })
  amount: number;

  @Column({ type: 'numeric', default: 0 })
  lineTotal: number;

  @Column()
  uom: string;

  @Column()
  currency: string;

  @ManyToOne(() => POItem, (poItem) => poItem.budgetSources)
  @JoinColumn({ name: 'poItemId' })
  poItem: POItem;
  @BeforeInsert()
  lineTotalCalculator() {
    this.lineTotal = this.quantity * this.amount;
  }
}
