import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from './tender-item.entity';

@Entity({ name: 'sor_fees' })
export class SorFee extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.fees)
  @JoinColumn({ name: 'itemId' })
  item: Item;

  @Column()
  category: string;

  @Column()
  position: string;

  @Column()
  nameOfStaff: string;

  @Column()
  staffMonthRate: number;

  @Column()
  inputStaffMonth: number;

  @Column()
  rate: number;
}
