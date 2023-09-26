import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { ServicePriceEntity } from '../../../vendor-registration/entities/service-price.entity';
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
  // @OneToOne(() => InvoiceEntity)
  // @JoinColumn()
  // invoice: InvoiceEntity;

  @OneToMany(() => ServicePriceEntity, (prc) => prc.service)
  priceSettings: ServicePriceEntity[];
}
