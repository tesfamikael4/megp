import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { BankAccountDetailEntity } from './bank-account-detail.entity';
import { Audit } from 'src/shared/entities';
@Entity({ name: 'brifecases' })
export class BrifecaseEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  attachmentId: string;
  @Column()
  userId: string;
}
