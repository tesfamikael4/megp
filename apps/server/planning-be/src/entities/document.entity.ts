import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'documents' })
export class Document extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column({ type: 'jsonb' })
  fileInfo: any;

  @Column()
  itemId: string;

  @Column()
  type: string;

  @Column()
  version: number;

  @Column()
  key: string;
}
