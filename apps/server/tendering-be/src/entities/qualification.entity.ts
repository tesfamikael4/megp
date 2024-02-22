import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';
import { Lot } from '.';

@Entity({ name: 'qualifications' })
export class Qualification extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (Lot) => Lot.qualifications)
  @JoinColumn()
  lot: Lot;

  @Column()
  factor: string;

  @Column()
  requirement: string;

  @Column({ type: 'jsonb' })
  singleEntityCondition: any;

  @Column({ type: 'jsonb' })
  jvEachPartnerCondition: any;

  @Column({ type: 'jsonb' })
  jvCombinedPartnerCondition: any;

  @Column({ type: 'jsonb' })
  jvAtleastOnePartnerCondition: any;

  @Column()
  order: number;

  @Column()
  formLink: string;

  @Column({ nullable: true })
  itbDescription: string;

  @Column()
  itbReference: string;

  @Column()
  isRequired: boolean;

  // Relation?
  @Column()
  spdQualificationId: string;
}
