import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Rule } from './rule.entity';
import { Audit } from 'src/shared/entities/audit.entity';
import { RuleDesigner } from './rule-designer.entity';

@Entity({ name: 'possible_reasons' })
export class PossibleReasons extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  reason: string;

  @Column()
  ruleDesignerId: string;

  @ManyToOne(() => RuleDesigner, (ruleDesigner) => ruleDesigner.possibleReasons)
  @JoinColumn({ name: 'ruleDesignerId' })
  ruleDesigner: RuleDesigner;
}
