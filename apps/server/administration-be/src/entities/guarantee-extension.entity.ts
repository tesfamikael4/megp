import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Guarantee } from './guarantee.entity';

@Entity({ name: 'guarantee_extensions' })
export class GuaranteeExtension {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  guaranteeId: string;
  @Column({ nullable: true })
  remark: string;
  @Column({ type: 'date', nullable: true })
  extensionDate: Date;
  @Column({
    type: 'enum',
    enum: ['reviewed', 'approved', 'rejected'],
    nullable: true,
  })
  status: string;
  @ManyToOne(() => Guarantee, (guarantee) => guarantee.guaranteeExtensions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guaranteeId' })
  guarantee: Guarantee;
}
