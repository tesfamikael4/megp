import { Audit } from '@audit';
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
import { TEAM_TYPE_ENUM } from 'src/shared/enums/team-type.enum';

@Entity({ name: 'procurement_disposal_units' })
export class ProcurementDisposalUnit extends Audit {
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
  public unit: Unit;

  @Column({
    type: 'enum',
    enum: TEAM_TYPE_ENUM,
    default: TEAM_TYPE_ENUM.DRAFT,
  })
  status: string;
}
