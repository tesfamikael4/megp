import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Classification } from './classification';


@Entity({ name: 'classification_path' })
export class ClassificationPath {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ nullable: true })
  ancestor_id: string;
  @Column({ nullable: true })
  descendant_id: string;
  @Column()
  depth: number;
  @ManyToOne(
    () => Classification,
    (classification) => classification.ancestorPaths,
  )
  ancestor: Classification;

  @ManyToOne(
    () => Classification,
    (classification) => classification.descendantPaths,
  )
  descendant: Classification;
}
