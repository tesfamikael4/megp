import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Audit } from 'src/shared/entities';
import { GuaranteeExtension } from './guarantee-extension.entity';
import { GuaranteeForfeit } from './guarantee-forfeit.entity';
import { GuaranteeRelease } from './guarantee-release.entity';
import { GuaranteeTypeEnum } from 'src/shared/enums/guarantee-type.enum';
import { GuaranteeStatusEnum } from 'src/shared/enums/guarantee-status.enum';

@Entity({ name: 'guarantees' })
export class Guarantee extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  vendorId: string;
  @Column()
  vendorName: string;
  @Column({ type: 'timestamptz', nullable: true })
  startDate: Date;
  @Column({ type: 'timestamptz', nullable: true })
  endDate: Date;
  @Column({
    type: 'enum',
    enum: GuaranteeTypeEnum,
  })
  type: string;
  @Column()
  objectType: string;
  @Column({ type: 'timestamptz', nullable: true })
  minValidityDate: Date;
  @Column({ type: 'timestamptz', nullable: true })
  guarantorValidityDate: Date;
  @Column()
  name: string;
  @Column()
  title: string;
  @Column({ type: 'uuid' })
  objectId: string;
  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  amount: number;
  @Column()
  currencyType: string;
  @Column({ type: 'uuid' })
  guarantorId: string;
  @Column()
  guarantorBranchName: string;
  @Column()
  guarantorName: string;
  @Column({ type: 'uuid' })
  guarantorBranchId: string;
  @Column({ nullable: true })
  remark: string;
  @Column({ nullable: true, type: 'jsonb' })
  attachment: any;
  @Column({
    type: 'enum',
    enum: GuaranteeStatusEnum,
    default: GuaranteeStatusEnum.REQUESTED,
    nullable: false,
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
