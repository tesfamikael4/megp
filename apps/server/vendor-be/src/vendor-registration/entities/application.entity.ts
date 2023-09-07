import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServicePriceEntity } from './service-price.entity';
import { MessageThreadEntity } from './message-thread.entity';
import { BusinessCategoryEntity } from './business-category.entity';
import { InvoiceEntity } from './invoice.entity';
import { CustomCategoryEntity } from './custom-category.entity';
import { ServicesEntity } from './services.entity';
import { VendorsEntity } from './vendors.entity';
//Vendor Service Application
@Entity({ name: 'applications' })
export class ApplicationEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'vendor_id', type: 'uuid' })
  vendorId: string;
  @Column({ name: 'service_Id' })
  serviceId: string;
  ///Goods , Services
  @Column({ name: 'business_area' })
  businessArea: string;
  @Column({ name: 'application_Id', type: 'uuid' })
  applicationId: string;
  @Column({ name: 'service_fee', type: 'decimal' })
  serviceFee: number;
  @Column({ nullable: true, name: 'submission_date' })
  submissionDate: Date;
  @Column({ name: 'application_status' })
  status: string;
  @Column({ name: 'approved_by', nullable: true, type: 'uuid' })
  approvedBy: string;
  @Column({ name: 'approved_date', nullable: true })
  approvedDate: Date;
  @Column({ name: 'expire_date', nullable: true })
  expireDate: Date;
  @ManyToOne(() => ServicePriceEntity, (p) => p.applications)
  @JoinColumn({ name: 'application_Id' })
  price: ServicePriceEntity;
  @OneToMany(() => MessageThreadEntity, (message) => message.application)
  messages: MessageThreadEntity[];

  @OneToMany(() => BusinessCategoryEntity, (business) => business.application)
  businessCats: BusinessCategoryEntity[]; //business categories

  invoice: InvoiceEntity;

  @OneToMany(() => CustomCategoryEntity, (cat) => cat.application)
  customCats: CustomCategoryEntity[]; //customeCategories

  @ManyToOne(() => ServicesEntity, (service) => service.applications)
  @JoinColumn({ name: 'service_Id' })
  service: ServicesEntity;

  @ManyToOne(() => VendorsEntity, (v) => v.applications)
  @JoinColumn({ name: 'vendor_id' })
  vendor: VendorsEntity;
}
