import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { CommonEntity } from 'src/shared/entities/common.entity';
import { ShareholdersEntity } from './shareholder.entity';
import { BankAccountDetailEntity } from './bank-account-detail.entity';
import { CustomCategoryEntity } from './custom-category.entity';
import { BusinessCategoryEntity } from './business-category.entity';
import { BeneficialOwnership } from './beneficial-ownership.entity';
import { AreasOfBusinessInterestEntity } from './areas-of-business-interest.entity';
import { Audit } from 'src/shared/entities/audit.entity';
import { WorkflowInstanceEntity } from './workflow-instance.entity';
import { IsrVendorsEntity } from './isr-vendors.entity';
@Entity({ name: 'vendors' })
export class VendorsEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'tin', nullable: true, unique: true })
  tin: string;
  @Column()
  userId: string;
  @Column({ name: 'isrVendorId', nullable: true })
  isrVendorId: string;
  @Column({ default: 'draft' })
  status: string;
  //legal form of entity
  @Column({ nullable: true })
  formOfEntity: string;
  @Column({ name: 'country', default: 'Malian' })
  country: string;

  @Column({ type: 'json', nullable: true })
  metaData: JSON;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  level: string;
  @Column({ nullable: true })
  origin: string;
  @Column({ nullable: true })
  district: string;

  @OneToMany(() => CustomCategoryEntity, (cat) => cat.application)
  customCats: CustomCategoryEntity[]; //customeCategories

  @OneToMany(() => BusinessCategoryEntity, (business) => business.vendor)
  businessCats: BusinessCategoryEntity[]; //business categories

  @OneToMany(() => BankAccountDetailEntity, (b) => b.vendor, {
    cascade: true,
  })
  vendorAccounts: BankAccountDetailEntity[];

  @OneToMany(() => ShareholdersEntity, (b) => b.vendor, {
    cascade: true,
  })
  shareholders: ShareholdersEntity[];

  @OneToMany(() => BeneficialOwnership, (b) => b.vendor, {
    cascade: true,
  })
  beneficialOwnership: BeneficialOwnership[];

  @OneToMany(() => WorkflowInstanceEntity, (wf) => wf.isrVendor)
  instances: WorkflowInstanceEntity[];

  @OneToMany(() => AreasOfBusinessInterestEntity, (b) => b.vendor, {
    cascade: true,
  })
  areasOfBusinessInterest: AreasOfBusinessInterestEntity[];

  @OneToOne(() => IsrVendorsEntity)
  @JoinColumn({ name: 'isrVendorId' })
  isrVendor: IsrVendorsEntity;
}
