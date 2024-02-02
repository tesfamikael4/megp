import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'hash' })
export class Hash extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hash: string;

  @Column()
  objectId: string;

  @Column()
  objectType: string;

  @Column()
  createdBy: string;
}
