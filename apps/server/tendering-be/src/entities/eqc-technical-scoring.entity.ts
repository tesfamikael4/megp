import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Tree,
  TreeParent,
  TreeChildren,
} from 'typeorm';
import { Lot } from '.';
import { TechnicalScoringAssessmentDetail } from './technical-scoring-assessment-detail.entity';
import { SpdBidForm } from './spd-bid-form.entity';

@Tree('closure-table')
@Entity({ name: 'eqc_technical_scorings' })
export class EqcTechnicalScoring extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (Lot) => Lot.eqcTechnicalScorings)
  @JoinColumn()
  lot: Lot;

  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @TreeChildren()
  children: EqcTechnicalScoring[];

  @TreeParent()
  parent: EqcTechnicalScoring[];

  @Column()
  requirement: string;

  @Column()
  requirementCondition: string;

  @Column()
  point: number;

  @Column()
  bidFormId: string;

  @ManyToOne(() => SpdBidForm, (spd) => spd.eqcTechnicalScorings)
  @JoinColumn({ name: 'bidFormId' })
  bidForm: SpdBidForm;

  // Relation?
  @Column({ type: 'uuid', nullable: true })
  spdTechnicalScoringId: string;

  // Relation?
  @Column({ type: 'uuid', nullable: true })
  spdTechnicalScoringParentId: string;

  @Column()
  isProfessional: boolean;

  @Column()
  hasProfessional: boolean;

  @Column({ type: 'jsonb' })
  validation: any;

  @Column()
  isRequired: boolean;

  @OneToMany(
    () => TechnicalScoringAssessmentDetail,
    (technicalScoringAssessmentDetail) =>
      technicalScoringAssessmentDetail.eqcTechnicalScoring,
  )
  @JoinColumn()
  technicalScoringAssessmentDetails: TechnicalScoringAssessmentDetail[];
}
