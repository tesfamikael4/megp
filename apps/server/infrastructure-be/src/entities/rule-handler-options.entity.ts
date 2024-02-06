import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { RuleHandler } from './rule-handler.entity';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'rule_handler_options' })
export class RuleHandlerOptions extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column({ type: 'simple-array', nullable: true })
  value: string[];

  @Column({ nullable: true })
  dataType: string;

  @Column()
  ruleHandlerId: string;

  @ManyToOne(() => RuleHandler, (ruleHandler) => ruleHandler.options)
  @JoinColumn({ name: 'ruleHandlerId' })
  ruleHandler: RuleHandler;
}
