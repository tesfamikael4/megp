import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFXItem } from './rfx-items.entity';
import { Audit } from 'megp-shared-be';
import { SolItemResponse } from './sol-item-response.entity';
import { SolRegistration } from './sol-registration.entity';
import { EvalItemResponse } from './eval-item-response.entity';

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

  @Column('uuid')
  rfxItemId: string;

  @ManyToOne(() => RFXItem, (rfx) => rfx.openedItemResponses)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;

  @Column('uuid')
  solItemResponseId: string;

  @OneToOne(
    () => SolItemResponse,
    (solItemResponse) => solItemResponse.openedItemResponse,
  )
  @JoinColumn({ name: 'solItemResponseId' })
  solItemResponse: SolItemResponse;

  @Column('uuid')
  solRegistrationId: string;

  @ManyToOne(
    () => SolRegistration,
    (solRegistration) => solRegistration.openedItemResponses,
  )
  @JoinColumn({ name: 'solRegistrationId' })
  solRegistration: SolRegistration;

  @OneToMany(
    () => EvalItemResponse,
    (evaluation) => evaluation.openedItemResponse,
  )
  evalItemResponses: EvalItemResponse[];
}
