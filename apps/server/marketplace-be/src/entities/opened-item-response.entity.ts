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
import { SolItemResponse } from './sol-item-response.entity';
import { SolRegistration } from './sol-registration.entity';

@Entity({ name: 'opened_response_items' })
@Unique(['rfxItemId', 'vendorId', 'key'])
export class OpenedItemResponse extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vendorId: string;

  @Column()
  key: string;

  @Column({ type: 'jsonb' })
  value: any;

  // Foreign Keys
  @Column('uuid')
  rfxItemId: string;

  @Column('uuid')
  solItemResponseId: string;

  @Column('uuid')
  solRegistrationId: string;

  // Relations
  @ManyToOne(() => RFXItem, (rfx) => rfx.openedItemResponses)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @OneToOne(
    () => SolItemResponse,
    (solItemResponse) => solItemResponse.openedItemResponse,
  )
  @JoinColumn({ name: 'solItemResponseId' })
  solItemResponse: SolItemResponse;

  @ManyToOne(
    () => SolRegistration,
    (solRegistration) => solRegistration.openedItemResponses,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistrations: SolRegistration;
}
