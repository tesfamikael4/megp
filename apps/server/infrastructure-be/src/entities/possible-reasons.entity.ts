import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RuleDesigner } from './rule-designer.entity';
import { Audit } from '@megp/shared-be';

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
