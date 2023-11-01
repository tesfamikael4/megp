import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from 'src/shared/entities/common.entity';
import { ShareholdersEntity } from './shareholder.entity';
import { BankAccountDetailEntity } from './bank-account-detail.entity';
import { CustomCategoryEntity } from './custom-category.entity';
import { BusinessCategoryEntity } from './business-category.entity';
import { BeneficialOwnership } from './beneficial-ownership.entity';
import { WorkflowInstanceEntity } from 'src/handling/entities/workflow-instance';
import { AreasOfBusinessInterestEntity } from './areas-of-business-interest.entity';
@Entity({ name: 'vendors' })
export class VendorsEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'tin', nullable: true })
  tin: string;
  @Column()
  userId: string;
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
  @OneToMany(() => WorkflowInstanceEntity, (wf) => wf.vendor)
  instances: WorkflowInstanceEntity[];

  @OneToMany(() => AreasOfBusinessInterestEntity, (b) => b.vendor, {
    cascade: true,
  })
  areasOfBusinessInterest: AreasOfBusinessInterestEntity[];
}
