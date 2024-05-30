import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Tree,
  TreeChildren,
  TreeParent,
} from 'typeorm';
import { TechnicalScoringAssessment } from './technical-scoring-assessments.entity';
import { OrgAudit } from 'src/shared/entities';
import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';
import { SorTechnicalRequirement } from './sor-technical-requirement.entity';
import { EqcTechnicalScoring } from './eqc-technical-scoring.entity';

@Tree('closure-table')
@Entity({ name: 'technical_scoring_assessments_details' })
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

  @Column({ nullable: true })
  remark: string;

  @Column({ type: 'int' })
  pointsAwarded: number;

  @Column({ type: 'int' })
  maxPoints: number;

  @Column({ default: false })
  isComplete: boolean;

  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @TreeChildren()
  children: TechnicalScoringAssessmentDetail[];

  @TreeParent()
  parent: TechnicalScoringAssessmentDetail;
}
