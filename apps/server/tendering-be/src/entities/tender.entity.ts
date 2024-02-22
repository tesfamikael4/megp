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
import { General } from './general.entity';
import { Preparation } from './preparation.entity';
import { Submission } from './submission.entity';
import { Evaluation } from './evaluation.entity';
import { Award } from './award.entity';

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

  @OneToOne(() => General, (general) => general.tender)
  general: General;

  @OneToOne(() => Preparation, (preparation) => preparation.tender)
  preparation: Preparation;

  @OneToOne(() => Submission, (submissions) => submissions.tender)
  submission: Submission;

  @OneToOne(() => Evaluation, (evaluations) => evaluations.tender)
  evaluation: Evaluation;

  @OneToOne(() => Award, (awards) => awards.tender)
  award: Award;

  @OneToOne(
    () => ProcurementMechanism,
    (procurementMechanism) => procurementMechanism.tender,
  )
  procurementMechanism: ProcurementMechanism;
}
