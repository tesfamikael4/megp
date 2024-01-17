import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rule } from './rule.entity';
import { Audit } from 'src/shared/entities';
import { PossibleReasons } from './possible-reasons.entity';

type Action = {
  type: string;
  name: string;
  value: string | string[];
};

export enum EnforcementMethodEnum {
  MANDATORY = 'MANDATORY',
  OPTIONAL = 'OPTIONAL',
  FLAG = 'FLAG',
}

@Entity({ name: 'rule_designer' })
export class RuleDesigner extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  key: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: EnforcementMethodEnum,
    default: EnforcementMethodEnum.OPTIONAL,
  })
  enforcementMethod: EnforcementMethodEnum;

  @OneToMany(() => Rule, (rules) => rules.designer)
  rules: Rule[];

  @Column({ type: 'jsonb' })
  actions: Action[];

  @OneToMany(
    () => PossibleReasons,
    (possibleReasons) => possibleReasons.ruleDesigner,
    {
      cascade: true,
    },
  )
  possibleReasons: PossibleReasons[];
}
