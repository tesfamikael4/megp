import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFX, EvalResponse, EvalItemResponse } from './index';
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

  @OneToMany(() => EvalResponse, (evaluation) => evaluation.evaluator)
  evalResponses: EvalResponse[];

  @OneToMany(() => EvalItemResponse, (evaluation) => evaluation.evaluator)
  evalItemResponses: EvalItemResponse[];
}
