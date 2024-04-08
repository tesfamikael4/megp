import { Audit } from 'src/shared/entities';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'message_templates' })
export class MessageTemplate extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  templateContent: string;
}
