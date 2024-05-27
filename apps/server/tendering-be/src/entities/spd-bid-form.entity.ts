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
import { SorTechnicalRequirement } from './sor-technical-requirement.entity';

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
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidForm,
  )
  spdPreliminaryEvaluations: SpdPreliminaryEvaluation[];

  @OneToMany(
    () => SpdProfessionalSetting,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidForm,
  )
  spdProfessionalSettings: SpdProfessionalSetting[];

  @OneToMany(
    () => SpdTechnicalScoring,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidForm,
  )
  spdTechnicalScorings: SpdTechnicalScoring[];

  @OneToMany(
    () => SpdQualification,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidForm,
  )
  spdQualifications: SpdQualification[];

  @OneToMany(
    () => EqcTechnicalScoring,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidForm,
  )
  eqcTechnicalScorings: EqcTechnicalScoring[];

  @OneToMany(
    () => EqcQualification,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidForm,
  )
  eqcQualifications: EqcQualification[];

  @OneToMany(
    () => EqcPreliminaryExamination,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidForm,
  )
  eqcPreliminaryExaminations: EqcPreliminaryExamination[];

  @OneToMany(
    () => SorTechnicalRequirement,
    (ppdPreliminaryEvaluations) => ppdPreliminaryEvaluations.bidForm,
  )
  sorTechnicalRequirements: SorTechnicalRequirement[];
}
