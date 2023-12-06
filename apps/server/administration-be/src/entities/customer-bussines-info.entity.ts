import { Audit } from '@audit';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'customer_bussines_infos' })
export class CustomerBussinesInfo extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tin: string;

  @Column()
  businessLicenseNumber: string;

  @Column()
  nationality: string;

  @Column()
  legalStatus: string;

  @Column()
  businessName: string;

  @Column({ type: 'timestamp' })
  dateRegistered: Date;

  @Column()
  organizationName: string;

  @Column()
  firstName: string;

  @Column()
  middleName: string;

  @Column()
  lastName: string;
}
