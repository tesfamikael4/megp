import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spd } from './spd.entity';
import { Audit } from 'src/shared/entities';
import { TechnicalQualificationAssessmentDetail } from './technical-qualification-assessment-detail.entity';

@Entity({ name: 'spd_qualifications' })
export class SpdQualification extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  spdId: string;

  @Column()
  category: string;

  @Column()
  factor: string;

  @Column()
  requirement: string;

  @Column()
  formLink: string;

  @Column()
  itbReference: string;

  @Column({ type: 'text', nullable: true })
  itbDescription: string;

  @ManyToOne(() => Spd, (spd) => spd.spdQualifications)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;

  @OneToMany(
    () => TechnicalQualificationAssessmentDetail,
    (technicalQualificationAssessmentDetail) =>
      technicalQualificationAssessmentDetail.spdQualification,
  )
  technicalQualificationAssessmentDetails: TechnicalQualificationAssessmentDetail[];
}
