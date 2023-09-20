import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CommonEntity } from 'src/shared/entities/common.entity';
import { ShareholdersEntity } from './shareholder.entity';
import { BankAccountDetailEntity } from './bank-account-detail.entity';
import { ApplicationEntity } from './application.entity';
import { CustomCategoryEntity } from './custom-category.entity';
import { BusinessCategoryEntity } from './business-category.entity';
@Entity({ name: 'vendors' })
export class VendorsEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'tin', nullable: true })
  tin: string;
  @Column({ name: 'user_id' })
  userId: string;
  @Column({ name: 'vendor_status', default: 'draft' })
  status: string;
  //legal form of entity
  @Column({ name: 'form_of_enity', nullable: true })
  formOfEntity: string;
  @Column({ name: 'country', default: 'Malian' })
  country: string;

  @Column({ name: 'meta_data', type: 'json', nullable: true })
  metaData: JSON;
  @Column({ name: 'name', nullable: true })
  name: string;
  @Column({ name: 'origin' })
  origin: string;
  @Column({ name: 'district' })
  district: string;

  @OneToMany(() => ApplicationEntity, (app) => app.service)
  applications: ApplicationEntity[];

  @OneToMany(() => CustomCategoryEntity, (cat) => cat.application)
  customCats: CustomCategoryEntity[]; //customeCategories

  @OneToMany(() => BusinessCategoryEntity, (business) => business.vendor)
  businessCats: BusinessCategoryEntity[]; //business categories
  /*
    @OneToMany(() => InvoiceEntity, (invoice) => invoice.vendor)
    invoices: InvoiceEntity[];
  */
  // @OneToMany(() => VendorsBankEntity, (b) => b.vendor)
  // vendorAccounts: VendorsBankEntity[];

  @OneToMany(() => BankAccountDetailEntity, (b) => b.vendor, {
    cascade: true,
  })
  vendorAccounts: BankAccountDetailEntity[];

  @OneToMany(() => ShareholdersEntity, (b) => b.vendor, {
    cascade: true,
  })
  shareholders: ShareholdersEntity[];
}
