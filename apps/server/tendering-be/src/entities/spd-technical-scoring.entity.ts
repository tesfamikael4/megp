import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { SpdEntity } from './spd.entity';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'spd_technical_scoring' })
export class SpdTechnicalScoringEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  spdId: string;

  @Column({ type: 'numeric' })
  orderNo: number;

  @Column({ type: 'uuid' })
  parentId: string;

  @Column()
  requirement: string;

  @Column()
  specification: string;

  @Column()
  requirementCondition: string;

  @Column({ type: 'numeric' })
  point: number;

  @Column()
  formLink: string;

  @Column()
  additionalRequirements: string;

  @Column({ type: 'jsonb' })
  validation: any;

  @Column()
  isRequired: boolean;

  @Column()
  isProfessional: boolean;

  @Column()
  isRangeBasedCriteria: boolean;

  @ManyToOne(() => SpdEntity, (spd) => spd.technicalScorings)
  @JoinColumn({ name: 'spdId' })
  spd: SpdEntity;
}
