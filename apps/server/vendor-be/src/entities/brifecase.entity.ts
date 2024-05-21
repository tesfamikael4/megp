import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Audit } from '@audit';
@Entity({ name: 'brifecases' })
export class BriefecaseEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  attachmentId: string;
  @Column()
  userId: string;
  @Column({ nullable: true })
  description: string;
  @Column({ nullable: true })
  name: string
}
