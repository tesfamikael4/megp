import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Lot } from '.';

@Entity({ name: 'eqc_qualifications' })
export class EqcQualification extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  lotId: string;

  @ManyToOne(() => Lot, (Lot) => Lot.eqcQualifications)
  @JoinColumn()
  lot: Lot;

  @Column()
  factor: string;

  @Column()
  requirement: string;

  @Column()
  category: string;

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
  @Column({ type: 'uuid', nullable: true })
  spdQualificationId: string;
}
