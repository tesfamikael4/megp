import { Audit } from '@audit';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IPDC } from './ipdc.entity';
import { MEMBER_TYPE_ENUM } from 'src/shared/enums/member-type.enum';

@Entity({ name: 'ipdc_members' })
export class IPDCMember extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  iPDCId: string;

  @ManyToOne(() => IPDC, (iPDC) => iPDC.iPDCMembers)
  @JoinColumn({ name: 'iPDCId' })
  public iPDC: IPDC;

  @Column({
    type: 'enum',
    enum: MEMBER_TYPE_ENUM,
    default: MEMBER_TYPE_ENUM.MEMBER,
  })
  type: string;

  @Column()
  userId: string;

  @Column()
  organizationId: string;
}
