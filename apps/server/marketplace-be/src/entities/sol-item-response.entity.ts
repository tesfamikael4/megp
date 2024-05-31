import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFXItem } from './rfx-items.entity';
import { Audit } from 'megp-shared-be';
import { OpenedItemResponse } from './opened-item-response.entity';
import { SolRegistration } from './sol-registration.entity';

@Entity({ name: 'sol_response_items' })
@Unique(['rfxItemId', 'solRegistrationId', 'key'])
export class SolItemResponse extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vendorId: string;

  @Column()
  key: string;

  @Column({ type: 'text' })
  value: string;

  @Column('uuid')
  rfxItemId: string;

  @ManyToOne(() => RFXItem, (rfx) => rfx.solItemResponses)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @Column('uuid')
  solRegistrationId: string;

  @ManyToOne(
    () => SolRegistration,
    (registration) => registration.solItemResponses,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;

  @OneToOne(
    () => OpenedItemResponse,
    (OpenedItemResponse) => OpenedItemResponse.solItemResponse,
  )
  openedItemResponse: OpenedItemResponse;
}
