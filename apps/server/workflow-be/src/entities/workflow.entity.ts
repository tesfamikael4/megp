import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Activity } from './activity.entity';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'workflows' })
export class Workflow extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;
}
