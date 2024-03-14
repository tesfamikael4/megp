import { OrgAudit } from '@audit';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { AdhocTeam } from './adhoc-team.entity';
import { MEMBER_TYPE_ENUM } from 'src/shared/enums/member-type.enum';
import { User } from './user.entity';

@Entity({ name: 'adhoc_team_members' })
export class AdhocTeamMember extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  adhocTeamId: string;

  @ManyToOne(() => AdhocTeam, (adhocTeam) => adhocTeam.adhocTeamMembers)
  @JoinColumn({ name: 'adhocTeamId' })
  public adhocTeam: AdhocTeam;

  @Column()
  userId: string;

  @ManyToOne(() => User, (User) => User.adhocTeamMembers)
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column({
    type: 'enum',
    enum: MEMBER_TYPE_ENUM,
    default: MEMBER_TYPE_ENUM.MEMBER,
  })
  type: string;
}
