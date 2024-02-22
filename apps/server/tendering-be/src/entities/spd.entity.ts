import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { SpdScc } from './spd-scc.entity';
import { SpdBds } from './spd-bds.entity';
import { SpdTechnicalScoring } from './spd-technical-scoring.entity';
import { Audit } from 'src/shared/entities';
import { SpdPreferenceMargin } from './spd-preference-margin.entity';
import { SpdRequiredDocumentaryEvidence } from './spd-required-documentary-evidence.entity';
import { SpdSetting } from './spd-setting.entity';
import { SpdQualification } from './spd-qualification.entity';
import { SpdAdministrativeCompliance } from './spd-administrative-compliance.entity';
import { SpdTemplate } from './spd-template.entity';
import { BdsGeneral } from './bds-general.entity';

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

  @OneToMany(() => SpdScc, (scc) => scc.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sccs: SpdScc[];

  @OneToMany(() => SpdBds, (bds) => bds.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  bds: SpdBds[];

  @OneToMany(() => SpdQualification, (qualification) => qualification.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  qualifications: SpdQualification[];

  @OneToMany(
    () => SpdAdministrativeCompliance,
    (administrative) => administrative.spd,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  spdAdministrativeCompliances: SpdAdministrativeCompliance[];

  @OneToMany(() => SpdTechnicalScoring, (scoring) => scoring.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  technicalScorings: SpdTechnicalScoring[];

  @OneToMany(() => SpdPreferenceMargin, (preference) => preference.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  spdPreferenceMargins: SpdPreferenceMargin[];

  @OneToMany(
    () => SpdRequiredDocumentaryEvidence,
    (documentary) => documentary.spd,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  spdRequiredDocumentaryEvidences: SpdRequiredDocumentaryEvidence[];

  @OneToMany(() => SpdSetting, (settings) => settings.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  spdSettings: SpdSetting[];

  @OneToMany(() => SpdTemplate, (spdTemplates) => spdTemplates.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  spdTemplates: SpdTemplate[];

  @OneToOne(() => BdsGeneral, (general) => general.spd)
  bdsGeneral: BdsGeneral;
}
