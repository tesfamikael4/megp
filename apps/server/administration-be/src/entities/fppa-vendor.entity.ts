import { Audit } from '@audit';
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import { BusinessArea } from './fppa-business-area.entity';

@Entity({ name: 'fppa_vendors_infos' })
export class FppaVendor extends Audit {
  @PrimaryColumn()
  id: number;

  @Column('numeric', { precision: 15, scale: 2 })
  supplierCode: number;

  @Column({ nullable: true })
  supplierName: string;

  @Column({ nullable: true })
  emailOfficial: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  businessTelephone: string;

  @Column({ nullable: true })
  mobileNumber: string;

  @Column({ nullable: true })
  postalAddress: string;

  @Column({ nullable: true })
  businessPremise: string;

  @Column({ nullable: true })
  expireDate: string;

  @Column({ nullable: true })
  signature: string;

  @Column('numeric', { precision: 15, scale: 2 })
  branchName: number;

  @Column({ nullable: true })
  accountName: string;

  @Column('numeric', { precision: 15, scale: 2 })
  accountNumber: number;

  @Column({ nullable: true })
  tradingName: string;

  @Column({ unique: true })
  companyTin: string;

  @Column('numeric', { precision: 15, scale: 2 })
  numberEmployeesStaff: number;

  @Column({ nullable: true })
  shareholderFirstName: string;

  @Column({ nullable: true })
  ShareholderLastName: string;

  @Column({ nullable: true })
  gender: string;

  @Column({ nullable: true })
  contactNumber: string;

  @Column({ nullable: true })
  businessType: string;

  @Column({ nullable: true })
  nationality: string;

  @Column({ nullable: true })
  businessLocation: string;

  @Column({ nullable: true })
  country: string;

  @Column({ nullable: true })
  supplierStatus: string;

  @Column({ nullable: true })
  applicationType: string;

  @Column({ nullable: true })
  dgApproval: string;

  @Column({ nullable: true })
  bankName: string;

  @Column({ nullable: true })
  accountType: string;

  @Column({ nullable: true })
  currency: string;

  @Column({ nullable: true })
  msmeType: string;

  @OneToMany(() => BusinessArea, (area) => area.fppaVendor)
  businessAreas: BusinessArea[];
}
