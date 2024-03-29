import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Guarantee } from './guarantee.entity';
import { GuaranteeReleaseEnum } from 'src/shared/enums/guarantee-release.enum';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'guarantee_releases' })
export class GuaranteeRelease extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  reason: string;
  @Column({ type: 'uuid' })
  guaranteeId: string;
  @Column({
    type: 'enum',
    enum: GuaranteeReleaseEnum,
  })
  status: string;
  @ManyToOne(() => Guarantee, (guarantee) => guarantee.releases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guaranteeId' })
  guarantee: Guarantee;
}
