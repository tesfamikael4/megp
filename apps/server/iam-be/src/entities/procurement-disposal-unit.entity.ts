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
  name: string;

  @Column()
  status: string;

  @Column()
  organizationId: string;
}
