import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { TaxonomyCodeSet } from './taxonomy-code-set.entity';

@Entity({ name: 'classifications' })
export class Classification extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  taxonomyCodeSetId: string;

  @Column({ nullable: true })
  parentCode: string;

  @ManyToOne(
    () => Classification,
    (classification) => classification.children,
    { nullable: true },
  )
  @JoinColumn({ name: 'parentCode', referencedColumnName: 'code' })
  parent: Classification;

  @ManyToOne(
    () => TaxonomyCodeSet,
    (taxonomyCodeSet) => taxonomyCodeSet.classifications,
  )
  @JoinColumn({ name: 'taxonomyCodeSetId', referencedColumnName: 'id' })
  taxonomyCodeSet: TaxonomyCodeSet;

  @OneToMany(() => Classification, (classification) => classification.parent)
  children: Classification[];

  @Column({ nullable: true })
  key: string;

  @Column({ unique: true })
  code: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true })
  definition: string;

  @Column({ nullable: true })
  type: string;

  @Column({ nullable: true })
  synonym: string;

  @Column({ nullable: true })
  acronym: string;

  @Column({ default: true })
  isActive: boolean;
}
