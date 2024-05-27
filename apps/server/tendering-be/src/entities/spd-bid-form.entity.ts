import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Spd } from './spd.entity';
import { BidResponseDocument } from './bid-response-document.entity';
import { SpdPreliminaryEvaluation } from './spd-preliminary-evaluation.entity';
import { SpdProfessionalSetting } from './spd-professional-setting.entity';
import { SpdTechnicalScoring } from './spd-technical-scoring.entity';
import { EqcTechnicalScoring } from './eqc-technical-scoring.entity';
import { EqcQualification } from './eqc-qualification.entity';
import { EqcPreliminaryExamination } from './eqc-preliminary-examination.entity';
import { SpdQualification } from './spd-qualification.entity';

@Entity({ name: 'spd_bid_forms' })
export class SpdBidForm extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column()
  code: string;

  @Column()
  type: string;

  @Column({ type: 'jsonb', nullable: true })
  documentDocx: any;

  @Column({ type: 'jsonb', nullable: true })
  documentPdf: any;

  @Column()
  spdId: string;

  @ManyToOne(() => Spd, (spd) => spd.spdBidForm)
  @JoinColumn({ name: 'spdId' })
  spd: Spd;

  @OneToMany(
    () => BidResponseDocument,
    (bidResponseItems) => bidResponseItems.bidForm,
  )
  bidResponseDocuments: BidResponseDocument[];

  @OneToMany(
    () => SpdPreliminaryEvaluation,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidFrom,
  )
  spdPreliminaryEvaluations: SpdPreliminaryEvaluation[];

  @OneToMany(
    () => SpdProfessionalSetting,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidFrom,
  )
  spdProfessionalSettings: SpdProfessionalSetting[];

  @OneToMany(
    () => SpdTechnicalScoring,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidFrom,
  )
  spdTechnicalScorings: SpdTechnicalScoring[];

  @OneToMany(
    () => SpdQualification,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidFrom,
  )
  spdQualifications: SpdQualification[];

  @OneToMany(
    () => EqcTechnicalScoring,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidFrom,
  )
  eqcTechnicalScorings: EqcTechnicalScoring[];

  @OneToMany(
    () => EqcQualification,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidFrom,
  )
  eqcQualifications: EqcQualification[];

  @OneToMany(
    () => EqcPreliminaryExamination,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidFrom,
  )
  eqcPreliminaryExaminations: EqcPreliminaryExamination[];
}
