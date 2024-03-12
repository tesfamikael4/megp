import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Rule } from './rule.entity';
import { Audit } from 'megp-shared-be';
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

  @OneToMany(() => Rule, (rules) => rules.designer, { cascade: true })
  rules: Rule[];

  @Column({ type: 'jsonb' })
  actions: Action[];

  @Column({ type: 'jsonb', default: [] })
  defaultActions: Action[];

  @OneToMany(
    () => PossibleReasons,
    (possibleReasons) => possibleReasons.designer,
    {
      cascade: true,
    },
  )
  possibleReasons: PossibleReasons[];
}
