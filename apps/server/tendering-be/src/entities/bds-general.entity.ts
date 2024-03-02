import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

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

  @Column()
  maximumPercentageContractingAllowed: boolean;

  @Column({ type: 'date' })
  clarificationDeadline: Date;

  @Column()
  preBidConferenceRequired: boolean;

  @Column({ type: 'date' })
  preBidConferenceDate: Date;

  @Column()
  siteVisitAllowed: boolean;
}
