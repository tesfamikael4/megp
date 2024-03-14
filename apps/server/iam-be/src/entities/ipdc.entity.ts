import { OrgAudit } from '@audit';
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

@Entity({ name: 'ipdc' })
export class IPDC extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  procurementInstitutionId: string;

  @ManyToOne(
    () => ProcurementInstitution,
    (procurementInstitution) => procurementInstitution.iPDCs,
  )
  @JoinColumn({ name: 'procurementInstitutionId' })
  public procurementInstitution: ProcurementInstitution;

  @OneToMany(() => IPDCMember, (iPDCMember) => iPDCMember.iPDC)
  public iPDCMembers: IPDCMember[];

  @Column({ default: 'Draft' })
  status: string;

  @Column()
  name: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;
}
