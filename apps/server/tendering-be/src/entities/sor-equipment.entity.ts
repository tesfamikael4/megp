import { Audit } from 'src/shared/entities';
import {
  PrimaryGeneratedColumn,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { Item } from './tender-item.entity';

@Entity({ name: 'sor_equipments' })
export class SorEquipment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.equipments)
  @JoinColumn({ name: 'itemId' })
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
