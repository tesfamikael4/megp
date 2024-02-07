import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SpdScc } from './spd-scc.entity';
import { SpdBds } from './spd-bds.entity';
import { SpdTechnicalScoring } from './spd-technical-scoring.entity';
import { Audit } from 'src/shared/entities';
import { SpdPreferenceMargin } from './spd-preference-margin.entity';
import { SpdRequiredDocumentaryEvidence } from './spd-required-documentary-evidence.entity';
import { SpdSetting } from './spd-setting.entity';
import { SpdQualification } from './spd-qualification.entity';
import { SpdAdministrativeCompliance } from './spd-administrative-compliance.entity';

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
  language: string;

  @Column()
  procurementCategory: string;

  @Column()
  marketType: string;

  @Column()
  procurementTool: string;

  @Column()
  contractingMethod: string;

  @Column({ type: 'jsonb', nullable: true })
  specializationType: any;

  @Column()
  isActive: boolean;

  @Column({ type: 'jsonb', nullable: true })
  document: any;

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
}
