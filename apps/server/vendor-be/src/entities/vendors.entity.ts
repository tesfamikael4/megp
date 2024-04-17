import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BankAccountDetailEntity } from './bank-account-detail.entity';
import { BeneficialOwnershipShares } from './beneficial-ownership-shareholers.entity';
import { AreasOfBusinessInterestEntity } from './areas-of-business-interest.entity';
import { Audit } from '@audit';
import { WorkflowInstanceEntity } from './workflow-instance.entity';
import { IsrVendorsEntity } from './isr-vendors.entity';
import { ProfileInfoEntity } from './profile-info.entity';
import { BusinessCategoryEntity } from './business-category.entity';
import { CustomCategoryEntity } from './custom-category.entity';
import { ShareholdersEntity } from './shareholder.entity';

@Entity({ name: 'vendors' })
export class VendorsEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  tinNumber: string;
  @Column({ nullable: true, unique: true })
  registrationNumber: string;
  @Column()
  userId: string;
  @Column({ name: 'isrVendorId', nullable: true })
  isrVendorId: string;
  @Column({ default: 'draft' })
  status: string;
  //legal form of entity
  @Column({ nullable: true })
  formOfEntity: string;
  @Column({ type: 'json', nullable: true })
  metaData: any;
  @Column({ default: true })
  canRequest: boolean;
  @Column({ nullable: true })
  name: string;
  @Column({ nullable: true })
  level: string;
  @Column({ nullable: true })
  countryOfRegistration: string;
  @Column({ nullable: true })
  district: string;
  @Column({ type: 'json', nullable: true })
  lineOfBusiness: any;
  @OneToMany(() => BankAccountDetailEntity, (b) => b.vendor, {
    cascade: true,
  })
  vendorAccounts: BankAccountDetailEntity[];

  @OneToMany(() => BeneficialOwnershipShares, (b) => b.vendor, {
    cascade: true,
  })
  beneficialOwnershipShareholders: BeneficialOwnershipShares[];

  @OneToMany(() => WorkflowInstanceEntity, (wf) => wf.isrVendor, {
    cascade: true,
  })
  instances: WorkflowInstanceEntity[];

  @OneToMany(() => AreasOfBusinessInterestEntity, (b) => b.vendor, {
    cascade: true,
  })
  areasOfBusinessInterest: AreasOfBusinessInterestEntity[];

  @OneToOne(() => IsrVendorsEntity)
  @JoinColumn({ name: 'isrVendorId' })
  isrVendor: IsrVendorsEntity;

  @OneToMany(() => ProfileInfoEntity, (profile) => profile.vendor)
  ProfileInfo: ProfileInfoEntity;

  //will be removed  all code below
  @OneToMany(() => ShareholdersEntity, (b) => b.vendor, {
    cascade: true,
  })
  shareholders: ShareholdersEntity[];

  @OneToMany(() => BusinessCategoryEntity, (business) => business.vendor)
  businessCats: BusinessCategoryEntity[]; //business categories
  @OneToMany(() => CustomCategoryEntity, (cat) => cat.application)
  customCats: CustomCategoryEntity[]; //customeCategories
}
