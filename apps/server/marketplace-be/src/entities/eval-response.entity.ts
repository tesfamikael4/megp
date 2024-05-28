import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { SolRegistration } from './sol-registration.entity';
import { RfxProductInvitation } from './rfx-product-invitation.entity';
import { EvaluationResponse } from 'src/utils/enums';
import { RfxProcurementTechnicalTeam } from './rfx-procurement-technical-team.entity';
import { RFX } from './rfx.entity';

@Entity({ name: 'eval_responses' })
@Unique(['evaluatorId', 'rfxId'])
export class EvalResponse extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'boolean', default: false })
  isTeamAssesment: boolean;

  @Column({
    type: 'enum',
    enum: EvaluationResponse,
  })
  qualified: EvaluationResponse;

  @Column({ nullable: true })
  remark: string;

  @Column('uuid')
  solRegistrationId: string;

  @Column('uuid')
  evaluatorId: string;

  @Column('uuid')
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.evalResponses)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @ManyToOne(() => RfxProcurementTechnicalTeam, (team) => team.evalResponses)
  @JoinColumn({ name: 'evaluatorId' })
  evaluator: RfxProcurementTechnicalTeam;

  @ManyToOne(
    () => SolRegistration,
    (registration) => registration.evalResponses,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;
}
