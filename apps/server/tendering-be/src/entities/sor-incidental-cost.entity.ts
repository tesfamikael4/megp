import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './tender-item.entity';

@Entity({ name: 'sor_incidental_costs' })
export class SorIncidentalCost extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.incidentalCosts)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column()
  itemNumber: string;

  @Column()
  description: string;

  @Column()
  country: string;

  @Column()
  quantity: number;

  @Column()
  rate: number;

  @Column()
  amount: number;

  @Column()
  currency: string;
}
