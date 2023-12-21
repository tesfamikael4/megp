import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SpdSccEntity } from './spd-scc.entity';
import { SpdBdsEntity } from './spd-bds.entity';
import { SpdTechnicalScoringEntity } from './spd-technical-scoring.entity';
import { Audit } from 'src/shared/entities';
import { SpdPrefeenceMargins } from './spd-prefeence-margins.entity';
import { SpdRequiredDocumentaryEvidences } from './spd-required-documentary-evidences.entity';
import { SpdSettings } from './spd-settings.entity';
@Entity({ name: 'spd' })
export class SpdEntity extends Audit {
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

  @OneToMany(() => SpdSccEntity, (scc) => scc.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  sccs: SpdSccEntity[];

  @OneToMany(() => SpdBdsEntity, (bds) => bds.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  bds: SpdBdsEntity[];

  @OneToMany(() => SpdTechnicalScoringEntity, (scoring) => scoring.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  technicalScorings: SpdTechnicalScoringEntity[];

  @OneToMany(() => SpdPrefeenceMargins, (prefeence) => prefeence.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  spdPrefeenceMargins: SpdPrefeenceMargins[];

  @OneToMany(
    () => SpdRequiredDocumentaryEvidences,
    (documentary) => documentary.spd,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },
  )
  spdRequiredDocumentaryEvidences: SpdRequiredDocumentaryEvidences[];

  @OneToMany(() => SpdSettings, (settings) => settings.spd, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  spdSettings: SpdSettings[];
}
