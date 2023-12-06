import { Audit } from '@audit';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'ncic_vendors' })
export class NcicVendor extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  tin: string;
  @Column()
  nameOfFirm: string;
  @Column()
  postalAddress: string;
  @Column()
  telephoneNumber: string;
  @Column()
  email: string;
  @Column()
  nationalOfFirm: string;
  @Column()
  typeOfRegistration: string;
  @Column()
  branch: string;
  @Column()
  category: string;
  @Column()
  district: string;
  @Column()
  region: string;
}
