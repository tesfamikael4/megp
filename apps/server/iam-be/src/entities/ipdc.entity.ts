import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProcurementInstitution } from './procurement-institution.entity';
import { IPDCMember } from './ipdc-members.entity';
import { Organization } from './organization.entity';
import { Audit } from 'src/shared/entities';
import { TEAM_TYPE_ENUM } from 'src/shared/enums/team-type.enum';

@Entity({ name: 'ipdc' })
export class IPDC extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  procurementInstitutionId: string;

  @ManyToOne(
    () => ProcurementInstitution,
    (procurementInstitution) => procurementInstitution.ipdcs,
  )
  @JoinColumn({ name: 'procurementInstitutionId' })
  public procurementInstitution: ProcurementInstitution;

  @OneToMany(() => IPDCMember, (iPDCMember) => iPDCMember.ipdc)
  public ipdcMembers: IPDCMember[];

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
