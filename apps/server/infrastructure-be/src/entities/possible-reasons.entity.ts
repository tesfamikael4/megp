import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Unique,
} from 'typeorm';
import { Rule } from './rule.entity';
import { Audit } from 'megp-shared-be';
import { RuleDesigner } from './rule-designer.entity';

@Entity({ name: 'possible_reasons' })
@Unique(['reason', 'designerId'])
export class PossibleReasons extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reason: string;

  @Column()
  designerId: string;

  @ManyToOne(
    () => RuleDesigner,
    (ruleDesigner) => ruleDesigner.possibleReasons,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'designerId' })
  designer: RuleDesigner;
}
