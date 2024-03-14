import { Audit, OrgAudit } from '@audit';
import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProcurementDisposalUnit } from './procurement-disposal-unit.entity';
import { IPDC } from './ipdc.entity';
import { AdhocTeam } from './adhoc-team.entity';

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

  @OneToMany(() => IPDC, (iPDCs) => iPDCs.procurementInstitution)
  iPDCs: IPDC[];

  @OneToMany(() => AdhocTeam, (adhocTeams) => adhocTeams.procurementInstitution)
  adhocTeams: AdhocTeam[];

  @Column({ default: 'Default Procurement Institution' })
  name: string;

  @Column({ default: 'Draft' })
  status: string;

  @Column()
  organizationId: string;
}
