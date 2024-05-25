import { Audit } from 'megp-shared-be';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'tender_notices' })
export class TenderNotice extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;
}
