import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Audit } from 'src/shared/entities';
import { GuaranteeExtension } from './guarantee-extension.entity';
import { GuaranteeForfeit } from './guarantee-forfeit.entity';
import { GuaranteeRelease } from './guarantee-release.entity';
@Entity({ name: 'guarantees' })
export class Guarantee extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  vendorId: string;
  @Column({
    type: 'date',
    nullable: true,
  })
  startDate: Date;
  @Column({ type: 'date', nullable: true })
  endDate: Date;
  @Column({
    type: 'enum',
    enum: ['bid guarantee', 'advanced', 'performance', 'retention'],
    nullable: true,
  })
  type: string;
  @Column({ nullable: true })
  objectType: string;
  @Column({ type: 'int', nullable: true })
  minValidityDate: number;
  @Column({ type: 'int', nullable: true })
  guarantorValidityDate: number;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  title: string;
  @Column({ nullable: true })
  objectId: string;
  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  amount: number;
  @Column({ nullable: true })
  currencyType: string;
  @Column({ nullable: true })
  guarantorId: string;
  @Column({ nullable: true })
  guarantorBranchId: string;
  @Column({ nullable: true })
  remark: string;
  @Column({ nullable: true })
  attachment: string;
  @Column({
    type: 'enum',
    enum: ['reviewed', 'approved', 'rejected'],
    nullable: true,
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
