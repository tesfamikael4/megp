import { Audit } from 'megp-shared-be';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { EvalResponse } from './eval-response.entity';
import { EvalItemResponse } from './eval-item-response.entity';
import { RFX } from '.';
import { EvalAssessment } from './eval-assessment.entity';

@Entity({ name: 'team_members' })
export class TeamMember extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  personnelId: string;

  @Column()
  personnelName: string;

  @Column({ type: 'boolean', default: false })
  isTeamLead: boolean;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'uuid' })
  organizationId: string;

  @Column()
  organizationName: string;

  @Column('uuid')
  rfxId: string;

  @ManyToOne(() => RFX, (evalTeam) => evalTeam.teamMembers)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @OneToMany(() => EvalAssessment, (evalTeam) => evalTeam.teamMember)
  evaluationAssessments: EvalAssessment[];

  @OneToMany(() => EvalResponse, (evalTeam) => evalTeam.teamMember)
  responseEvaluations: EvalResponse[];

  @OneToMany(() => EvalItemResponse, (evalItemTeam) => evalItemTeam.teamMember)
  itemResponseEvaluations: EvalItemResponse[];
}
