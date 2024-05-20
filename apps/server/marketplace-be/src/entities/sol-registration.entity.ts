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
import { RFX } from './rfx.entity';
import { ESolRegistrationStatus } from 'src/utils/enums/sol.enum';
import { SolResponse } from './sol-response.entity';

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

  @OneToMany(() => SolResponse, (response) => response.registration)
  responses: SolResponse;
}
