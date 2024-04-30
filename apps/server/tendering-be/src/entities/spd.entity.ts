import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SpdTechnicalScoring } from './spd-technical-scoring.entity';
import { Audit } from 'src/shared/entities';
import { SpdPreferenceMargin } from './spd-preference-margin.entity';
import { SpdPreliminaryEvaluation } from './spd-preliminary-evaluation.entity';
import { SpdProfessionalSetting } from './spd-professional-setting.entity';
import { SpdQualification } from './spd-qualification.entity';
import { SpdTemplate } from './spd-template.entity';
import { SpdBidForm } from './spd-bid-form.entity';
import { SpdContractForm } from './spd-contract-form.entity';
import { TenderSpd } from './tender-spd.entity';
import { SpdOpeningChecklist } from './spd-opening-checklist.entity';
import { SpdDocumentaryEvidence } from './spd-documentary-evidence.entity';

@Entity({ name: 'spd' })
export class Spd extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb', nullable: true })
  governingRule: any;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column()
  marketType: string;

  @Column()
  procurementCategory: string;

  @Column()
  isActive: boolean;

  @OneToMany(
    () => SpdPreferenceMargin,
    (spdPreferenceMargin) => spdPreferenceMargin.spd,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  spdPreferenceMargins: SpdPreferenceMargin[];

  @OneToMany(
    () => SpdPreliminaryEvaluation,
    (spdPreliminaryEvaluation) => spdPreliminaryEvaluation.spd,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  spdPreliminaryEvaluations: SpdPreliminaryEvaluation[];

  @OneToMany(
    () => SpdProfessionalSetting,
    (spdProfessionalSetting) => spdProfessionalSetting.spd,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  spdProfessionalSettings: SpdProfessionalSetting[];

  @OneToMany(
    () => SpdQualification,
    (spdQualification) => spdQualification.spd,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  spdQualifications: SpdQualification[];

  @OneToMany(
    () => SpdTechnicalScoring,
    (spdTechnicalScore) => spdTechnicalScore.spd,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  spdTechnicalScores: SpdTechnicalScoring[];

  @OneToMany(() => SpdTemplate, (spdTemplates) => spdTemplates.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  spdTemplates: SpdTemplate[];

  @OneToMany(() => SpdBidForm, (spdBidForm) => spdBidForm.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  spdBidForm: SpdBidForm[];

  @OneToMany(
    () => SpdOpeningChecklist,
    (SpdOpeningChecklist) => SpdOpeningChecklist.spd,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  spdOpeningChecklists: SpdOpeningChecklist[];

  @OneToMany(() => SpdContractForm, (spdContractForm) => spdContractForm.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  spdContractForm: SpdContractForm[];

  @OneToMany(
    () => SpdDocumentaryEvidence,
    (spdDocumentaryEvidence) => spdDocumentaryEvidence.spd,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  spdDocumentaryEvidences: SpdDocumentaryEvidence[];

  @OneToMany(() => TenderSpd, (tender) => tender.spd)
  tenderSpds: TenderSpd[];
}
