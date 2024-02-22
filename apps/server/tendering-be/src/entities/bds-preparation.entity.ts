import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'bds_preparations' })
export class BdsPreparation extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @OneToOne(() => Tender, (tender) => tender.bdsPreparation)
  @JoinColumn()
  tender: Tender;

  @Column({ type: 'jsonb' })
  currencyOfTheBidForNationalBidders: any;

  @Column({ type: 'jsonb' })
  currencyOfTheBidForInternationalBidders: any;

  @Column()
  incotermsEdition: string;

  @Column()
  incotermType: string;

  @Column()
  bidValidityPeriod: number;
}
