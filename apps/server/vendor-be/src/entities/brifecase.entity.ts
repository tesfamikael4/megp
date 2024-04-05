import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities';
@Entity({ name: 'brifecases' })
export class BriefecaseEntity extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  attachmentId: string;
  @Column()
  userId: string;
}
