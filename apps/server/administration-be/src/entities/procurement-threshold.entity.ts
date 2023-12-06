import { Audit } from '@audit';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'procurement_thresholds' })
export class ProcurementThreshold extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  procurementType: string;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  minThreshold: number;
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  maxThreshold: number;
  @Column()
  procurementMethod: string;
  @Column()
  approvalDelegation: string;
}
