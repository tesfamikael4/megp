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

  @Column({ unique: true })
  reason: string;

  @Column()
  ruleDesignerId: string;

  @ManyToOne(
    () => RuleDesigner,
    (ruleDesigner) => ruleDesigner.possibleReasons,
    { onDelete: 'CASCADE', onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'ruleDesignerId' })
  ruleDesigner: RuleDesigner;
}
