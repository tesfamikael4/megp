import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TechnicalScoringAssessment } from './technical-scoring-assessments.entity';
import { OrgAudit } from 'src/shared/entities';
import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';
import { SorTechnicalRequirement } from './sor-technical-requirement.entity';
import { EqcTechnicalScoring } from './eqc-technical-scoring.entity';

@Entity()
export class TechnicalScoringAssessmentDetail extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  technicalScoringAssessmentId: string;

  @ManyToOne(
    () => TechnicalScoringAssessment,
    (technicalScoringAssessment) =>
      technicalScoringAssessment.technicalScoringAssessmentDetail,
    { cascade: true },
  )
  @JoinColumn({ name: 'technicalScoringAssessmentId' })
  technicalScoringAssessment: TechnicalScoringAssessment;

  @Column('uuid')
  eqcTechnicalScoringId: string;

  @ManyToOne(
    () => EqcTechnicalScoring,
    (eqcTechnicalScoring) =>
      eqcTechnicalScoring.technicalScoringAssessmentDetails,
  )
  @JoinColumn({ name: 'eqcTechnicalScoringId' })
  eqcTechnicalScoring: EqcTechnicalScoring;

  @Column({
    type: 'enum',
    enum: EvaluationStatusEnum,
    default: EvaluationStatusEnum.NOT_DONE,
  })
  qualified: string;

  @Column({ nullable: true })
  remark: string;
}
