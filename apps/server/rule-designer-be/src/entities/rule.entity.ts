import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { RuleDesigner } from './rule-designer.entity';
import { PossibleReasons } from './possible-reasons.entity';
import { Audit } from 'src/shared/entities';

type Condition = {
  type: string;
  field: string;
  value: string;
  joinType: string;
  operator: string;
};

// type Action = {
//   type: string;
//   name: string;
//   value: string | string[];
// };

// export enum EnforcementMethodEnum {
//   MANDATORY = 'MANDATORY',
//   OPTIONAL = 'OPTIONAL',
//   FLAG = 'FLAG',
// }

@Entity({ name: 'rules' })
export class Rule extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
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

  // @Column({
  //   type: 'enum',
  //   enum: EnforcementMethodEnum,
  //   default: EnforcementMethodEnum.OPTIONAL,
  // })
  // enforcementMethod: EnforcementMethodEnum;

  @Column({ type: 'jsonb' })
  conditions: Condition[][];

  // @Column({ type: 'jsonb' })
  // actions: Action[];

  // @OneToMany(() => PossibleReasons, (possibleReasons) => possibleReasons.rule, {
  //   cascade: true,
  // })
  // possibleReasons: PossibleReasons[];
}
