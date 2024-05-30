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
import { ESolRegistrationStatus } from 'src/utils/enums/sol.enum';
import {
  EvalItemResponse,
  EvalResponse,
  OpenedItemResponse,
  OpenedOffer,
  OpenedResponse,
  RFX,
  SolItemResponse,
  SolOffer,
  SolResponse,
} from '.';
import { EvalAssessment } from './eval-assessment.entity';

@Entity({ name: 'sol_registration' })
@Unique(['rfxId', 'vendorId'])
export class SolRegistration extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.solRegistrations)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column()
  vendorId: string;

  @Column()
  vendorName: string;

  @Column()
  salt: string;

  @Column()
  response: string;

  @Column({
    type: 'enum',
    enum: ESolRegistrationStatus,
    default: ESolRegistrationStatus.REGISTERED,
  })
  status: string;

  @OneToMany(() => SolOffer, (offers) => offers.solRegistration)
  solOffers: SolOffer[];

  @OneToMany(() => OpenedOffer, (offers) => offers.solRegistration)
  openedOffers: OpenedOffer[];

  @OneToMany(() => SolResponse, (response) => response.solRegistration)
  solResponses: SolResponse[];

  @OneToMany(() => OpenedResponse, (response) => response.solRegistration)
  openedResponses: OpenedResponse[];

  @OneToMany(
    () => SolItemResponse,
    (itemResponse) => itemResponse.solRegistration,
  )
  solItemResponses: SolItemResponse[];

  @OneToMany(
    () => OpenedItemResponse,
    (itemResponse) => itemResponse.solRegistration,
  )
  openedItemResponses: OpenedItemResponse[];

  @OneToMany(
    () => EvalItemResponse,
    (itemResponse) => itemResponse.solRegistration,
  )
  evalItemResponses: EvalItemResponse[];

  @OneToMany(() => EvalResponse, (itemResponse) => itemResponse.solRegistration)
  evalResponses: EvalResponse[];

  @OneToMany(
    () => EvalAssessment,
    (itemResponse) => itemResponse.solRegistration,
  )
  evaluationAssessments: EvalAssessment[];
}
