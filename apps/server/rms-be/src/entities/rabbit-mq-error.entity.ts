import { Audit } from 'megp-shared-be';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'rabbit_mq_errors' })
export class RabbitMqError extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  data: any;

  @Column({ type: 'jsonb' })
  error: any;

  @Column()
  queue: string;

  @Column()
  application: string;
}
