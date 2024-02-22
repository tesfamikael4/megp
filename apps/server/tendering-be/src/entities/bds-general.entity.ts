import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';
import { Spd } from './spd.entity';

@Entity({ name: 'bds_generals' })
export class BdsGeneral extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @OneToOne(() => Tender, (tender) => tender.bdsGeneral)
  @JoinColumn()
  tender: Tender;

  @Column()
  jointVentureAllowed: boolean;

  @Column()
  maximumNumberOfMembers: number;

  @Column()
  subContractAllowed: boolean;

  @Column({ type: 'date' })
  maximumPercentageContractingAllowed: Date;

  @Column({ type: 'date' })
  clarificationDeadline: Date;

  @Column()
  preBidConferenceRequired: boolean;

  @Column({ type: 'date' })
  preBidConferenceDate: Date;

  @Column()
  spdId: string;

  @OneToOne(() => Spd, (spd) => spd.bdsGeneral)
  @JoinColumn()
  spd: Spd;

  @Column()
  siteVisitAllowed: boolean;
}
