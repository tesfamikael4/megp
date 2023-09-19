import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// import { ApplicationEntity } from './application.entity';
// import { CommonEntity } from 'src/shared/entities/common.entity';
// import { CustomCategoryEntity } from './custom-category.entity';
// import { BusinessCategoryEntity } from './business-category.entity';
// import { InvoiceEntity } from './invoice.entity';
// import { VendorsBankEntity } from './vendors-bank.entity';
import { ShareholdersEntity } from './shareholder.entity';
import { CommonEntity } from 'src/shared/entities/common.entity';
@Entity({ name: 'file' })
export class FilesEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'file_name' })
  fileName: string;
  @Column({ name: 'file_type' })
  fileType: string;
  @Column({ name: 'path' })
  path: string;
  @Column({ name: 'vendor_id' })
  vendorId: string;
}
