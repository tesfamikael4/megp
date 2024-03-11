import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Guarantee } from './guarantee.entity';

@Entity({ name: 'guarantee_releases' })
export class GuaranteeRelease {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  reason: string;
  @Column({ nullable: true })
  guaranteeId: string;
  @Column({
    type: 'enum',
    enum: ['reviewed', 'approved', 'rejected'],
    nullable: true,
  })
  status: string;
  @ManyToOne(() => Guarantee, (guarantee) => guarantee.releases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guaranteeId' })
  guarantee: Guarantee;
}
