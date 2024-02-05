import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Activity } from './activity.entity';
import { OrgAudit } from '@megp/shared-be';

@Entity({ name: 'states' })
export class State extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  activityId: string;

  @ManyToOne(() => Activity, (activity) => activity.id)
  activity: Activity;

  @Column({ type: 'jsonb' })
  state: any[];
}
