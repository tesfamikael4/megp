import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'notes' })
export class Note extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.notes)
  @JoinColumn({ name: 'tenderId' })
  tender: Tender;

  @Column()
  content: string;

  @Column()
  key: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: any;

  @Column()
  objectId: string;

  @Column()
  objectType: string;
}
