import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot } from '.';

@Entity({ name: 'technical_scorings' })
export class TechnicalScoring extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (Lot) => Lot.technicalScorings)
  @JoinColumn()
  lot: Lot;

  @Column({ nullable: true })
  parentId: string;

  @OneToOne(
    () => TechnicalScoring,
    (technicalScoring) => technicalScoring.child,
  )
  @JoinColumn()
  parent: TechnicalScoring;

  @OneToOne(
    () => TechnicalScoring,
    (technicalScoring) => technicalScoring.child,
  )
  child: TechnicalScoring;

  @Column()
  requirement: string;

  @Column()
  requirementCondition: string;

  @Column()
  point: number;

  @Column()
  formLink: string;

  // Relation?
  @Column({ nullable: true })
  spdTechnicalScoringId: string;

  // Relation?
  @Column({ nullable: true })
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
