import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from '.';

@Entity({ name: 'reimburseable_expense' })
export class ReimburseableExpense extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => Item, (item) => item.reimburseableExpense)
  @JoinColumn()
  item: Item;

  @Column()
  itemNumber: string;

  @Column()
  description: string;

  @Column()
  unit: string;

  @Column()
  quantity: number;

  @Column()
  unitCost: number;

  @Column()
  cost: number;
}
