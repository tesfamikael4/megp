import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

import { Audit } from 'src/shared/entities';

@Entity({ name: 'hashes' })
export class Hash extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  hash: string;

  @Column({ type: 'jsonb' })
  originalData: any;

  @Column()
  objectId: string;

  @Column()
  objectType: string;

  @Column()
  createdBy: string;
}
