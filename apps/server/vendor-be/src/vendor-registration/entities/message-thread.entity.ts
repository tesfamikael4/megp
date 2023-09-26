import { CommonEntity } from 'src/shared/entities/common.entity';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'messsage_threads' })
export class MessageThreadEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'application_id', type: 'uuid' })
  applicationId: string;
  @Column({ name: 'message_source' })
  messageSource: string;
  @Column({ name: 'messsage' })
  message: string;
}
