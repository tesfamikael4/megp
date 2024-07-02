import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from 'megp-shared-be';
import { ReceivingNote } from './receiving-note.entity';

@Entity({ name: 'receiving_attachments' })
export class ReceivingAttachment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  receivingNoteId: string;

  @Column({ type: 'jsonb' })
  fileInfo: any;

  @Column()
  title: string;

  @ManyToOne(
    () => ReceivingNote,
    (receivedItem) => receivedItem.receivingAttachments,
  )
  @JoinColumn({ name: 'receivingNoteId' })
  receivingNote: ReceivingNote;
}
