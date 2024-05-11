import { Audit } from 'megp-shared-be';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'documents' })
export class Document extends Audit {
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
