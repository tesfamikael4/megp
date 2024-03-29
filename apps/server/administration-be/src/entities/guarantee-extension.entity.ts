import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Guarantee } from './guarantee.entity';
import { GuaranteeExtensionEnum } from 'src/shared/enums/guarantee.extension.enum';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'guarantee_extensions' })
export class GuaranteeExtension extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  guaranteeId: string;
  @Column({ nullable: true })
  remark: string;
  @Column({ type: 'timestamptz' })
  extensionDate: Date;
  @Column({
    type: 'enum',
    enum: GuaranteeExtensionEnum,
  })
  status: string;
  @ManyToOne(() => Guarantee, (guarantee) => guarantee.guaranteeExtensions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'guaranteeId' })
  guarantee: Guarantee;
}
