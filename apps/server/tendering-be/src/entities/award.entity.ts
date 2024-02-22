import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'awards' })
export class Award extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @OneToOne(() => Tender, (tender) => tender.award)
  @JoinColumn()
  tender: Tender;

  @Column()
  percentageQuantityIncreased: number;

  @Column()
  percentageQuantityDecreased: number;

  @Column()
  negotiationAllowed: boolean;
}
