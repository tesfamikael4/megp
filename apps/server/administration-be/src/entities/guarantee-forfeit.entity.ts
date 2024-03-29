import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Guarantee } from './guarantee.entity';
import { Audit } from 'src/shared/entities';
import { GuaranteeForefitStatusEnum } from 'src/shared/enums/guarantee-forefit.enum';

@Entity({ name: 'guarantee_forfeits' })
export class GuaranteeForfeit extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  reason: string;
  @Column({ type: 'uuid' })
  guaranteeId: string;
  @Column({ type: 'json', nullable: true })
  attachment: any;
  @Column({
    type: 'enum',
    enum: GuaranteeForefitStatusEnum,
  })
  status: string;
  @ManyToOne(() => Guarantee, (guarantee) => guarantee.forfeits, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guaranteeId' })
  guarantee: Guarantee;
}
