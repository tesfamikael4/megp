import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';
import { EqcPreliminaryExamination } from './eqc-preliminary-examination.entity';
import { EqcQualification } from './eqc-qualification.entity';
import { EqcTechnicalScoring } from './eqc-technical-scoring.entity';
import { EqcPreferenceMargin } from './eqc-preference-margin.entity';
import { EqcDueDiligence } from './eqc-due-diligence.entity';
import { Item } from './tender-item.entity';
import { BdsBidSecurity } from './bds-bid-security.entity';
import { BidRegistrationDetail } from './bid-registration-detail.entity';

@Entity({ name: 'lots' })
export class Lot extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.lots)
  @JoinColumn()
  tender: Tender;

  @Column()
  number: number;

  @Column()
  name: string;

  @Column()
  status: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @OneToMany(() => Item, (item) => item.lot)
  items: Item[];

  @OneToMany(
    () => EqcPreliminaryExamination,
    (EqcPreliminaryExamination) => EqcPreliminaryExamination.lot,
  )
  eqcPreliminaryExaminations: EqcPreliminaryExamination[];

  @OneToMany(() => EqcQualification, (eqcQualification) => eqcQualification.lot)
  eqcQualifications: EqcQualification[];

  @OneToMany(
    () => EqcTechnicalScoring,
    (eqcTechnicalScoring) => eqcTechnicalScoring.lot,
  )
  eqcTechnicalScorings: EqcTechnicalScoring[];

  @OneToMany(
    () => EqcPreferenceMargin,
    (eqcQreferenceMargin) => eqcQreferenceMargin.lot,
  )
  eqcPreferenceMargins: EqcPreferenceMargin[];

  @OneToMany(() => EqcDueDiligence, (eqcDueDelegence) => eqcDueDelegence.lot)
  eqcDueDiligences: EqcDueDiligence[];

  @OneToMany(() => BdsBidSecurity, (bdsBidSecurity) => bdsBidSecurity.lot)
  bdsBidSecurity: BdsBidSecurity[];

  @OneToMany(
    () => BidRegistrationDetail,
    (bidRegistrationDetails) => bidRegistrationDetails.lot,
  )
  bidRegistrationDetails: BidRegistrationDetail[];
}
