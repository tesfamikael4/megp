import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFX } from './rfx.entity';
import { Audit } from 'megp-shared-be';

@Entity({ name: 'rfx_procurement_technical_teams' })
@Unique(['rfxId', 'userId'])
export class RfxProcurementTechnicalTeam extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  rfxId: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  userName: string;

  @Column()
  isTeamLead: boolean;

  @ManyToOne(() => RFX, (rfx) => rfx.rfxProcurementTechnicalTeams)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;
}
