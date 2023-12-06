import { Audit } from '@audit';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tax_payers' })
export class TaxPayer extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  tin: string;

  @Column()
  taxpayerName: string;

  @Column('simple-json')
  tradingNames: string[];

  @Column()
  postalAddress: string;

  @Column()
  businessSectorISIC: string;

  @Column()
  taxpayerSegment: string;

  @Column()
  registrationDate: Date;
}
