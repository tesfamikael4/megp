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
  ancestorId: string;
  @Column({ nullable: true })
  descendantId: string;
  @Column()
  depth: number;

  @ManyToOne(() => Classification, (e) => e.classificationPaths)
  @JoinColumn({ name: 'classificationId' })
  classifications: Classification;
  // @ManyToOne(
  //   () => Classification,
  //   (classification) => classification.ancestorPaths,
  // )
  // ancestor: Classification;

  // @ManyToOne(
  //   () => Classification,
  //   (classification) => classification.descendantPaths,
  // )
  // descendant: Classification;
}
