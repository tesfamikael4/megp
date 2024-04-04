import { Audit } from '@audit';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProcurementInstitution } from './procurement-institution.entity';
import { AdhocTeamMember } from './adhoc-team-member.entity';
import { TEAM_TYPE_ENUM } from 'src/shared/enums/team-type.enum';

@Entity({ name: 'adhoc_teams' })
export class AdhocTeam extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  procurementInstitutionId: string;

  @ManyToOne(
    () => ProcurementInstitution,
    (procurementInstitution) => procurementInstitution.adhocTeams,
  )
  @JoinColumn({ name: 'procurementInstitutionId' })
  public procurementInstitution: ProcurementInstitution;

  @OneToMany(
    () => AdhocTeamMember,
    (adhocTeamMember) => adhocTeamMember.adhocTeam,
  )
  public adhocTeamMembers: AdhocTeamMember[];

  @Column({
    type: 'enum',
    enum: TEAM_TYPE_ENUM,
    default: TEAM_TYPE_ENUM.DRAFT,
  })
  status: string;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
