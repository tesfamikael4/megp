import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot } from '.';

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

  @ManyToOne(
    () => EqcTechnicalScoring,
    (technicalScoring) => technicalScoring.children,
  )
  @JoinColumn()
  parent: EqcTechnicalScoring;

  @OneToMany(
    () => EqcTechnicalScoring,
    (technicalScoring) => technicalScoring.parent,
  )
  children: EqcTechnicalScoring[];

  @Column()
  requirement: string;

  @Column()
  requirementCondition: string;

  @Column()
  point: number;

  @Column()
  formLink: string;

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
}
