import { Audit } from 'megp-shared-be';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Invoice } from './invoice.entity';

@Entity({ name: 'invoice_attachments' })
export class InvoiceAttachment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  invoiceId: string;

  @Column({ type: 'jsonb' })
  fileInfo: any;

  @Column()
  title: string;

  @ManyToOne(() => Invoice, (invoice) => invoice.attachments)
  @JoinColumn({ name: 'invoiceId' })
  invoice: Invoice;
}
