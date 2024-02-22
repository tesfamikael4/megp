import { Audit } from 'src/shared/entities';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Item } from '.';

// same with labor
@Entity({ name: 'equipments' })
export class Equipment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.equipments)
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
  rate: number;

  @Column()
  amount: number;
}
