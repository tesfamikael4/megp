import { OrgAudit } from '@audit';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ProcurementInstitution } from './procurement-institution.entity';
import { Unit } from './unit.entity';

@Entity({ name: 'procurement_disposal_units' })
export class ProcurementDisposalUnit extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  procurementInstitutionId: string;

  @OneToOne(
    () => ProcurementInstitution,
    (procurementInstitution) => procurementInstitution.procurementDisposalUnits,
  )
  @JoinColumn({ name: 'procurementInstitutionId' })
  public procurementInstitution: ProcurementInstitution;

  @Column()
  unitId: string;

  @ManyToOne(() => Unit, (unit) => unit.procurementDisposalUnits)
  @JoinColumn({ name: 'unitId' })
  public unit: ProcurementInstitution;

  @Column()
  name: string;

  @Column({ default: 'Draft' })
  status: string;
}
