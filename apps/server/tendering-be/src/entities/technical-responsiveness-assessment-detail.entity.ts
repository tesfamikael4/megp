import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TechnicalResponsivenessAssessment } from './technical-responsiveness-assessments.entity';
import { OrgAudit } from 'src/shared/entities';
import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';
import { SorTechnicalRequirement } from './sor-technical-requirement.entity';

@Entity({ name: 'technical_responsiveness_assessment_details' })
export class TechnicalResponsivenessAssessmentDetail extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  technicalResponsivenessAssessmentId: string;

  @ManyToOne(
    () => TechnicalResponsivenessAssessment,
    (technicalResponsivenessAssessment) =>
      technicalResponsivenessAssessment.technicalResponsivenessAssessmentDetail,
    { cascade: true },
  )
  @JoinColumn({ name: 'technicalResponsivenessAssessmentId' })
  technicalResponsivenessAssessment: TechnicalResponsivenessAssessment;

  @Column('uuid')
  sorTechnicalRequirementId: string;

  @ManyToOne(
    () => SorTechnicalRequirement,
    (sorTechnicalRequirement) =>
      sorTechnicalRequirement.technicalResponsivenessAssessmentDetails,
  )
  @JoinColumn({ name: 'sorTechnicalRequirementId' })
  sorTechnicalRequirement: SorTechnicalRequirement;

  @Column({
    type: 'enum',
    enum: EvaluationStatusEnum,
    default: EvaluationStatusEnum.NOT_DONE,
  })
  qualified: string;

  @Column({ nullable: true })
  remark: string;
}
