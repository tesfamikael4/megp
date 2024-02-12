import { OrgAudit } from 'megp-shared-be';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity({ name: 'notes' })
export class Notes extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  objectId: string;

  @Column()
  objectType: string;

  @Column('uuid')
  parentId: string;

  @Column('text')
  content: string;

  @Column('jsonb')
  metaData: any;

  @ManyToOne(() => Notes, (note) => note.children)
  @JoinColumn({ name: 'parentId' })
  parent: Notes[];

  @OneToMany((type) => Notes, (note) => note.parent)
  children: Notes[];
}
