import { Entity, Column, PrimaryGeneratedColumn, OneToOne } from 'typeorm';
import { Activity } from './activity.entity';

@Entity({ name: 'workflows' })
export class Workflow {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @OneToOne(() => Activity, (activity) => activity.workflow, {
    cascade: true,
  })
  activities: Activity;

  @Column({ type: 'jsonb' })
  metadata: any;
}
