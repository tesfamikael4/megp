import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tender } from './tender.entity';

@Entity({ name: 'tender_personals' })
export class TenderPersonal extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  tenderId: string;

  @ManyToOne(() => Tender, (tender) => tender.tenderPersonals)
  @JoinColumn()
  tender: Tender;

  @Column()
  position: string;

  @Column()
  evaluated: boolean;

  @Column({ type: 'integer' })
  order: number;
}
