import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from 'src/shared/entities';
import { Spd } from './spd.entity';
import { TechnicalPreliminaryAssessment } from './technical-preliminary-assessment.entity';

@Entity({ name: 'spd_preliminary_evaluations' })
export class SpdPreliminaryEvaluation extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  spdId: string;

  @Column()
  criteria: string;

  @Column()
  type: string;

  @Column()
  formLink: string;

  @Column()
  itbReference: string;

  @Column({ type: 'text', nullable: true })
  itbDescription: string;

  @ManyToOne(() => Spd, (spd) => spd.spdPreliminaryEvaluations)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;

  @OneToMany(
    () => TechnicalPreliminaryAssessment,
    (technicalPreliminaryAssessment) =>
      technicalPreliminaryAssessment.SpdPreliminaryEvaluation,
  )
  @JoinColumn()
  technicalPreliminaryAssessment: TechnicalPreliminaryAssessment;
}
