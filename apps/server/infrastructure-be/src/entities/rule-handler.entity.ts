import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { RuleHandlerOptions } from './rule-handler-options.entity';
import { Audit } from 'megp-shared-be';

enum HandlerTypesEnum {
  CONDITION = 'CONDITION',
  ACTION = 'ACTION',
}
@Entity({ name: 'rule_handlers' })
export class RuleHandler extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: HandlerTypesEnum,
    default: HandlerTypesEnum.CONDITION,
  })
  type: HandlerTypesEnum;

  @OneToMany(
    () => RuleHandlerOptions,
    (ruleHandlerOptions) => ruleHandlerOptions.ruleHandler,
    { cascade: true },
  )
  options: RuleHandlerOptions[];
}
