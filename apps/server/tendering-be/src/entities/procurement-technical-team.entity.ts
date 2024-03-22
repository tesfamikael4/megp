import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'procurement_technical_teams' })
export class ProcurementTechnicalTeam extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.procurementTechnicalTeams)
  @JoinColumn()
  tender: Tender;

  @Column()
  userId: string;

  @Column({ nullable: true })
  userName: string;

  @Column()
  isTeamLead: boolean;
}
