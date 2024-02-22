import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProcurementTechnicalTeam } from './procurement-technical-team.entity';
import { ProcurementMechanism } from './procurement-mechanism.entity';
import { Lot } from './lot.entity';
import { BdsGeneral } from './bds-general.entity';
import { BdsSubmission } from './bds-submission.entity';
import { BdsEvaluation } from './bds-evaluation.entity';
import { BdsPreparation } from './bds-preparation.entity';
import { BdsAward } from './bds-award.entity';

@Entity({ name: 'tenders' })
export class Tender extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ nullable: true })
  procurementReferenceNumber: string;

  @Column()
  budgetAmount: number;

  @Column()
  budgetAmountCurrency: string;

  @Column()
  budgetCode: string;

  @Column()
  prId: string;

  @Column()
  marketEstimate: number;

  @Column()
  marketEstimateCurrency: string;

  @Column()
  status: string;

  @Column({ type: 'jsonb' })
  metadata: any;

  @Column()
  organizationId: string;

  @OneToMany(
    () => ProcurementTechnicalTeam,
    (procurementTechnicalTeam) => procurementTechnicalTeam.tender,
  )
  procurementTechnicalTeams: ProcurementTechnicalTeam[];

  @OneToMany(() => Lot, (lot) => lot.tender)
  lots: Lot[];

  @OneToOne(() => BdsGeneral, (general) => general.tender)
  bdsGeneral: BdsGeneral;

  @OneToOne(() => BdsPreparation, (preparation) => preparation.tender)
  bdsPreparation: BdsPreparation;

  @OneToOne(() => BdsSubmission, (submissions) => submissions.tender)
  bdsSubmission: BdsSubmission;

  @OneToOne(() => BdsEvaluation, (evaluations) => evaluations.tender)
  bdsEvaluation: BdsEvaluation;

  @OneToOne(() => BdsAward, (awards) => awards.tender)
  bdsAward: BdsAward;

  @OneToOne(
    () => ProcurementMechanism,
    (procurementMechanism) => procurementMechanism.tender,
  )
  procurementMechanism: ProcurementMechanism;
}
