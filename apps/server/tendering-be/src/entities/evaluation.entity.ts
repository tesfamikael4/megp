import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'evaluations' })
export class Evaluation extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @OneToOne(() => Tender, (tender) => tender.evaluation)
  @JoinColumn()
  tender: Tender;

  @Column({ type: 'simple-array' })
  bidEvaluationCurrency: string[];

  @Column()
  evaluationMethod: string;

  @Column()
  selectionMethod: string;

  @Column()
  awardType: string;

  @Column()
  technicalWeight: number;

  @Column()
  financialWeight: number;

  @Column()
  passingMark: number;
}
