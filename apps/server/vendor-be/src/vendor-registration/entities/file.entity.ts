import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
// import { ApplicationEntity } from './application.entity';
// import { CommonEntity } from 'src/shared/entities/common.entity';
// import { CustomCategoryEntity } from './custom-category.entity';
// import { BusinessCategoryEntity } from './business-category.entity';
// import { InvoiceEntity } from './invoice.entity';
// import { VendorsBankEntity } from './vendors-bank.entity';
import { ShareholdersEntity } from './shareholder.entity';
import { CommonEntity } from 'src/shared/entities/common.entity';
import { Audit } from 'src/shared/entities/audit.entity';
@Entity({ name: 'files' })
export class FilesEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  fileName: string;
  @Column()
  fileType: string;
  @Column()
  bucketName: string;
  @Column()
  originalName: string;
  @Column({ nullable: true })
  attachmentUrl: string;
  @Column()
  path: string;
  @Column()
  vendorId: string;
}
