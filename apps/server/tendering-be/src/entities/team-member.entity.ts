import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'team_members' })
export class TeamMember extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  teamId: string;

  @Column('uuid')
  personnelId: string;

  @Column('uuid')
  personnelName: string;

  // @ManyToOne(type => EvaluationTeam, evaluationTeam => evaluationTeam.members)
  // team: EvaluationTeam;

  // @ManyToOne(type => User, user => user.teamMembers)
  // personnel: User;

  @Column('boolean')
  isTeamLead: boolean;

  @Column('boolean')
  isActive: boolean;
}
