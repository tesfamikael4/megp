import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { Team } from './team.entity';
import { TechnicalPreliminaryAssessment } from './technical-preliminary-assessment.entity';

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

  @Column()
  personnelName: string;

  @Column('boolean')
  isTeamLead: boolean;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(
    () => TechnicalPreliminaryAssessment,
    (technicalPreliminaryAssessment) =>
      technicalPreliminaryAssessment.evaluatorId,
  )
  @JoinColumn()
  technicalPreliminaryAssessment: TechnicalPreliminaryAssessment;
}
