import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { InvoiceEntity } from './invoice.entity';
import { Audit } from 'src/shared/entities';
@Entity({ name: 'receipts' })
export class PaymentReceiptEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  invoiceId: string;
  @Column()
  referenceNumber: string;
  @Column()
  remark: string;
  @Column({ nullable: true })
  filePath: string;
  @Column({ nullable: true })
  fileType: string;
  @OneToOne(() => InvoiceEntity)
  @JoinColumn()
  invoice: InvoiceEntity;
}
