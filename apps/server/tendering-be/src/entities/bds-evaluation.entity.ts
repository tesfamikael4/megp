import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';
import {
  AwardTypeEnum,
  EvaluationMethodEnum,
  SelectionMethodEnum,
} from 'src/shared/enums';

@Entity({ name: 'bds_evaluations' })
export class BdsEvaluation extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @OneToOne(() => Tender, (tender) => tender.bdsEvaluation)
  @JoinColumn()
  tender: Tender;

  @Column({ type: 'simple-array' })
  bidEvaluationCurrency: string[];

  @Column({ type: 'enum', enum: EvaluationMethodEnum })
  evaluationMethod: string;

  @Column({ type: 'enum', enum: SelectionMethodEnum })
  selectionMethod: string;

  @Column({ type: 'enum', enum: AwardTypeEnum })
  awardType: string;

  @Column()
  technicalWeight: number;

  @Column()
  financialWeight: number;

  @Column()
  passingMark: number;
}
