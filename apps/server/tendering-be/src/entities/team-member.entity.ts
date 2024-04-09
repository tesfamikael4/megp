import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { Team } from './team.entity';

@Entity({ name: 'team_members' })
export class TeamMember extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  teamId: string;

  @ManyToOne(() => Team, (team) => team.teamMembers)
  @JoinColumn({ name: 'teamId' })
  team: Team;

  @Column('uuid')
  personnelId: string;

  @Column('uuid')
  personnelName: string;

  @Column('boolean')
  isTeamLead: boolean;

  @Column('boolean')
  isActive: boolean;
}
