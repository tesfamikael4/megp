import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { TechnicalQualificationAssessment } from './technical-qualification-assessments.entity';
import { OrgAudit } from 'src/shared/entities';
import { SpdQualification } from './spd-qualification.entity';
import { EvaluationStatusEnum } from 'src/shared/enums/evaluation-status.enum';

@Entity()
export class TechnicalQualificationAssessmentDetail extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  technicalQualificationAssessmentId: string;

  @ManyToOne(
    () => TechnicalQualificationAssessment,
    (technicalQualificationAssessment) =>
      technicalQualificationAssessment.technicalQualificationAssessmentDetail,
    { cascade: true },
  )
  @JoinColumn({ name: 'technicalQualificationAssessmentId' })
  technicalQualificationAssessment: TechnicalQualificationAssessment;

  @Column('uuid')
  spdQualificationId: string;

  @ManyToOne(
    () => SpdQualification,
    (spdQualification) =>
      spdQualification.technicalQualificationAssessmentDetails,
  )
  @JoinColumn({ name: 'spdQualificationId' })
  spdQualification: SpdQualification;

  @Column({
    type: 'enum',
    enum: EvaluationStatusEnum,
    default: EvaluationStatusEnum.NOT_DONE,
  })
  qualified: string;

  @Column({ nullable: true })
  remark: string;
}
