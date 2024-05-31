import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFX, RfxRevisionApproval } from './index';
import { Audit } from 'megp-shared-be';

@Entity({ name: 'rfx_procurement_technical_teams' })
@Unique(['rfxId', 'userId'])
export class RfxProcurementTechnicalTeam extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ nullable: true })
  userName: string;

  @Column()
  isTeamLead: boolean;

  @Column()
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.rfxProcurementTechnicalTeams)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @OneToMany(
    () => RfxRevisionApproval,
    (revisiotn) => revisiotn.rfxProcurementTechnicalTeam,
  )
  rfxRevisionApprovals: RfxRevisionApproval[];
}
