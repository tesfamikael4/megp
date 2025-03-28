import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { RuleDesigner } from './rule-designer.entity';
import { Audit } from 'megp-shared-be';

type Condition = {
  type: string;
  field: string;
  value: string;
  joinType: string;
  operator: string;
};

@Entity({ name: 'rules' })
@Unique(['key', 'designerId'])
export class Rule extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  key: string;

  @Column()
  designerId: string;

  @ManyToOne(() => RuleDesigner, (designer) => designer.rules, {
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  designer: RuleDesigner;

  @Column()
  executionOrder: number;

  @Column({ type: 'jsonb' })
  conditions: Condition[][];
}
