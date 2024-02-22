import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Item } from '.';

@Entity({ name: 'fees' })
export class Fee extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  itemId: string;

  @ManyToOne(() => Item, (item) => item.fees)
  @JoinColumn()
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
