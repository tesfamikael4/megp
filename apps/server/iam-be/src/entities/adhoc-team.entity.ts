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

  @Column()
  status: string;

  @Column()
  organizationId: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
