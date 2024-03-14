import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ClarificationResponse } from './clarification-response.entity';

@Entity({ name: 'clarification_requests' })
export class ClarificationRequest extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  requesterId: string;

  @Column()
  requesterEmail: string;

  @Column({ type: 'uuid' })
  objectId: string;

  @Column()
  objectType: string;

  @Column()
  subject: string;

  @Column()
  request: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true, type: 'jsonb' })
  fileInfo: any;

  @Column({ nullable: true, type: 'simple-array' })
  tags: string[];

  @Column({ nullable: true })
  clarificationResponseId: string;

  @ManyToOne(
    () => ClarificationResponse,
    (clarificationResponse) => clarificationResponse.clarificationRequests,
  )
  @JoinColumn({ name: 'clarificationResponseId' })
  clarificationResponse: ClarificationResponse;
}
