import { OrgAudit } from 'src/shared/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'openings' })
export class Opening extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  tenderId: string;

  @OneToOne(() => Tender, (tender) => tender.opening)
  @JoinColumn()
  tender: Tender;

  @Column('text')
  openingType: string;

  @Column('text')
  status: string;

  @Column('boolean')
  isReportReady: boolean;
}
