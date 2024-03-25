import { Audit } from '@audit';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProcurementDisposalUnit } from './procurement-disposal-unit.entity';
import { IPDC } from './ipdc.entity';
import { AdhocTeam } from './adhoc-team.entity';
import { Organization } from './organization.entity';

@Entity({ name: 'procurement_institutions' })
export class ProcurementInstitution extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(
    () => ProcurementDisposalUnit,
    (procurementDisposalUnits) =>
      procurementDisposalUnits.procurementInstitution,
  )
  procurementDisposalUnits: ProcurementDisposalUnit;

  @OneToMany(() => IPDC, (ipdcs) => ipdcs.procurementInstitution)
  ipdcs: IPDC[];

  @OneToMany(() => AdhocTeam, (adhocTeams) => adhocTeams.procurementInstitution)
  adhocTeams: AdhocTeam[];

  @Column({ default: 'Default Procurement Institution' })
  name: string;

  @Column({ default: 'Draft' })
  status: string;

  @Column()
  organizationId: string;

  @ManyToOne(
    () => Organization,
    (organization) => organization.procurementInstitution,
  )
  @JoinColumn({ name: 'organizationId' })
  public organization: Organization;
}
