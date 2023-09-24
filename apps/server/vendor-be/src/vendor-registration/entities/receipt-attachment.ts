import {
  Column,
  Entity,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { ServicePriceEntity } from './service-price.entity';
import { InvoiceEntity } from './invoice.entity';
@Entity({ name: 'receiptAttachments' })
export class PaymentReceiptEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  invoiceId: string;
  @Column()
  referenceNumber: string;
  @Column()
  remark: string;
  @Column()
  filePath: string;
  @Column()
  fileType: string;

  @OneToOne(() => InvoiceEntity, (inv) => inv.receipt)
  invoice: InvoiceEntity;

  @OneToMany(() => ServicePriceEntity, (prc) => prc.service)
  priceSettings: ServicePriceEntity[];
}
