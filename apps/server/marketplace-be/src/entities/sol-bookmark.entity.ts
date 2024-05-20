import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { RFX } from './rfx.entity';
import { ESolBookmarkStatus } from 'src/utils/enums/sol.enum';

@Entity({ name: 'sol_bookmark' })
@Unique(['rfxId', 'vendorId'])
export class SolBookmark extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  rfxId: string;

  @ManyToOne(() => RFX, (rfx) => rfx.solBookmarks)
  @JoinColumn({ name: 'rfxId' })
  rfx: RFX;

  @Column()
  vendorId: string;

  @Column({
    type: 'enum',
    enum: ESolBookmarkStatus,
    default: ESolBookmarkStatus.BOOKMARKED,
  })
  status: string;
}
