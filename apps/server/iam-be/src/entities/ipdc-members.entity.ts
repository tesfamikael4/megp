import { OrgAudit } from '@audit';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IPDC } from './ipdc.entity';
import { MEMBER_TYPE_ENUM } from 'src/shared/enums/member-type.enum';
import { User } from './user.entity';

@Entity({ name: 'ipdc_members' })
export class IPDCMember extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  ipdcId: string;

  @ManyToOne(() => IPDC, (iPDC) => iPDC.ipdcMembers)
  @JoinColumn({ name: 'ipdcId' })
  public ipdc: IPDC;

  @Column({
    type: 'enum',
    enum: MEMBER_TYPE_ENUM,
    default: MEMBER_TYPE_ENUM.MEMBER,
  })
  type: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (User) => User.iPDCMembers)
  @JoinColumn({ name: 'userId' })
  public user: User;
}
