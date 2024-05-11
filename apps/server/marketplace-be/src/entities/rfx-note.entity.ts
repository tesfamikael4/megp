import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { RFX } from './rfx.entity';

@Entity({ name: 'rfx_notes' })
export class RfxNote extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.notes)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column()
  content: string;

  @Column()
  key: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column()
  objectId: string;

  @Column()
  objectType: string;
}
