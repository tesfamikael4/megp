import { Audit } from '@audit';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'fppa_vendors_infos' })
export class FppaVendor extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  tin: string;
  @Column()
  supplierCode: string;
  @Column()
  supplierName: string;
  @Column()
  businessType: string;
  @Column()
  accountNo: string;
  @Column()
  accountName: string;
  @Column()
  mobileNumber: string;
}
