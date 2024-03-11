import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Guarantee } from './guarantee.entity';

@Entity({ name: 'guarantee_forfeits' })
export class GuaranteeForfeit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  reason: string;
  @Column({ nullable: true })
  guaranteeId: string;
  @Column({ type: 'json', nullable: true })
  attachment: any;
  @Column({ type: 'enum', enum: ['reviewed', 'approved', 'rejected'] })
  status: string;
  @ManyToOne(() => Guarantee, (guarantee) => guarantee.forfeits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guaranteeId' })
  guarantee: Guarantee;
}
