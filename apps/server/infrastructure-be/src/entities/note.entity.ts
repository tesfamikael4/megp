import { OrgAudit } from 'megp-shared-be';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  Tree,
  TreeParent,
  TreeChildren,
} from 'typeorm';

@Tree('closure-table')
@Entity({ name: 'notes' })
export class Notes extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  objectId: string;

  @Column()
  objectType: string;

  @Column({ type: 'uuid', nullable: true })
  parentId: string;

  @Column('text')
  content: string;

  @Column('jsonb')
  metaData: any;

  @TreeParent()
  parent: Notes;

  @TreeChildren()
  children: Notes[];

  @Column()
  key: string;
}
