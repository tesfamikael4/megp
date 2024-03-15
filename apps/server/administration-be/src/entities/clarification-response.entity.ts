import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ClarificationRequest } from './clarification-request.entity';

@Entity({ name: 'clarification_response' })
export class ClarificationResponse extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToMany(
    () => ClarificationRequest,
    (clarificationRequest) => clarificationRequest.clarificationResponse,
  )
  clarificationRequests: ClarificationRequest[];

  @Column()
  rephrasedQuestion: string;

  @Column()
  response: string;

  @Column({ nullable: true })
  title: string;

  @Column({ nullable: true, type: 'jsonb' })
  fileInfo: any;

  @Column({ type: 'uuid' })
  responderId: string;
}
