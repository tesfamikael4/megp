import { Audit } from 'src/shared/entities';
import { ClassificationPath } from './classification-path';
import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
@Entity({ name: 'classification' })
export class Classification extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  key: string;

  @Column({ nullable: true })
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

  @ManyToOne(
    () => Classification,
    (classification) => classification.children,
    { nullable: true },
  )
  @JoinColumn({ name: 'parentId' })
  @Column({ nullable: true })
  parentId: string;
  parent: Classification;

  @OneToMany(() => Classification, (classification) => classification.parent)
  children: Classification[];

  @OneToMany(
    () => ClassificationPath,
    (classificationPath) => classificationPath.classifications,
    { cascade: true },
  )
  classificationPaths: ClassificationPath[];
}
