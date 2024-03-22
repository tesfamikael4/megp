import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Audit } from 'src/shared/entities';
import { GuaranteeExtension } from './guarantee-extension.entity';
import { GuaranteeForfeit } from './guarantee-forfeit.entity';
import { GuaranteeRelease } from './guarantee-release.entity';

export enum GuaranteeStatusEnum {
  REQUESTED = 'REQUESTED',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export enum GuaranteeTypeEnum {
  BID_SECURITY = 'BID_SECURITY',
  ADVANCED = 'ADVANCED',
  PERFORMANCE = 'PERFORMANCE',
  RETENTION = 'RETENTION',
}

@Entity({ name: 'guarantees' })
export class Guarantee extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  vendorId: string;
  @Column()
  startDate: Date;
  @Column()
  endDate: Date;
  @Column({
    type: 'enum',
    enum: GuaranteeTypeEnum,
  })
  type: string;
  @Column()
  objectType: string;
  @Column({ type: 'date', nullable: true })
  minValidityDate: Date;
  @Column()
  guarantorValidityDate: Date;
  @Column()
  name: string;
  @Column()
  title: string;
  @Column()
  objectId: string;
  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  amount: number;
  @Column()
  currencyType: string;
  @Column()
  guarantorId: string;
  @Column()
  guarantorBranchId: string;
  @Column({ nullable: true })
  remark: string;
  @Column({ nullable: true, type: 'jsonb' })
  attachment: any;
  @Column({
    type: 'enum',
    enum: GuaranteeStatusEnum,
    default: GuaranteeStatusEnum.REQUESTED,
  })
  status: string;
  @OneToMany(() => GuaranteeExtension, (extension) => extension.guarantee, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  guaranteeExtensions: GuaranteeExtension[];
  @OneToMany(() => GuaranteeForfeit, (forfeit) => forfeit.guarantee, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  forfeits: GuaranteeForfeit[];
  @OneToMany(() => GuaranteeRelease, (release) => release.guarantee, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  releases: GuaranteeRelease[];
}
