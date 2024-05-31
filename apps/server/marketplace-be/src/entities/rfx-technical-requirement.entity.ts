import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RFXItem } from './rfx-items.entity';

@Entity({ name: 'rfx_technical_requirements' })
export class RfxTechnicalRequirement extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  technicalSpecification: any;

  @Column({ type: 'jsonb' })
  deliverySpecification: any;

  @Column()
  rfxItemId: string;

  @OneToOne(() => RFXItem, (item) => item.technicalRequirement)
  @JoinColumn({ name: 'rfxItemId' })
  rfxItem: RFXItem;
}
