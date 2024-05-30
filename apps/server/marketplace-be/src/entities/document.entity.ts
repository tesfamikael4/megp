import { Audit } from 'megp-shared-be';
import { Entity, Column, PrimaryGeneratedColumn, Unique } from 'typeorm';

@Entity({ name: 'documents' })
@Unique(['key', 'itemId'])
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

  @Column({ type: 'uuid', nullable: true })
  userId: string;

  @Column({ nullable: true, type: 'uuid' })
  organizationId: string;

  @Column({ nullable: true })
  organizationName: string;
}
