import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './tender-item.entity';

@Entity({ name: 'sor_labors' })
export class SorLabor extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  itemId: string;

  @ManyToOne(() => Item, (item) => item.labors)
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

  @Column({ nullable: true })
  rate: number;

  @Column({ nullable: true })
  amount: number;
}
