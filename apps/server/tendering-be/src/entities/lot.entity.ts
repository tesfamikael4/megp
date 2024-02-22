import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';
import { Item } from './Item.entity';
import { PreliminaryExamination } from './preliminary-examination.entity';
import { Qualification } from './qualification.entity';
import { TechnicalScoring } from './technical-scoring.entity';
import { PreferenceMargin } from './preference-margin.entity';
import { DueDiligence } from './due-diligence.entity';

@Entity({ name: 'lots' })
export class Lot extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.lots)
  @JoinColumn()
  tender: Tender;

  @Column()
  number: number;

  @Column()
  name: string;

  @Column()
  status: string;

  @Column({ type: 'jsonb' })
  metadata: any;

  @OneToMany(() => Item, (item) => item.lot)
  items: Item[];

  @OneToMany(
    () => PreliminaryExamination,
    (preliminaryExamination) => preliminaryExamination.lot,
  )
  preliminaryExaminations: PreliminaryExamination[];

  @OneToMany(() => Qualification, (qualification) => qualification.lot)
  qualifications: Qualification[];

  @OneToMany(() => TechnicalScoring, (technicalScoring) => technicalScoring.lot)
  technicalScorings: TechnicalScoring[];

  @OneToMany(() => PreferenceMargin, (preferenceMargin) => preferenceMargin.lot)
  preferenceMargins: PreferenceMargin[];

  @OneToMany(() => DueDiligence, (dueDelegence) => dueDelegence.lot)
  dueDelegences: DueDiligence[];
}
