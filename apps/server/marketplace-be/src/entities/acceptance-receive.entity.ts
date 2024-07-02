import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from 'megp-shared-be';
import { ReceivingNote } from './receiving-note.entity';
import { AcceptanceNote } from './acceptance-note.entity';

@Entity({ name: 'acceptance_receives' })
export class AcceptanceReceive extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  receivingNoteId: string;

  @Column({ type: 'uuid' })
  acceptanceNoteId: string;

  @ManyToOne(
    () => AcceptanceNote,
    (acceptanceNote) => acceptanceNote.deliveryReceives,
  )
  @JoinColumn({ name: 'acceptanceNoteId' })
  acceptanceNote: AcceptanceNote;

  @ManyToOne(
    () => ReceivingNote,
    (receivingNote) => receivingNote.acceptanceReceives,
  )
  @JoinColumn({ name: 'receivingNoteId' })
  receivingNote: ReceivingNote;
}
