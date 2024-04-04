import { OrgAudit } from 'src/shared/entities';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'openings' })
export class Opening extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  tenderId: string;

  @Column('uuid')
  lotId: string;

  @Column('text')
  openingType: string;

  @Column('text')
  status: string;

  @Column('boolean')
  isReportReady: boolean;
}
