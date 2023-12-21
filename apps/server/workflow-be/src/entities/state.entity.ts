import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from 'src/shared/entities/audit.entity';
import { Activity } from './activity.entity';

@Entity({ name: 'states' })
export class State extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  activityId: string;

  @OneToOne(() => Activity, (activity) => activity.id)
  activity: Activity;

  @Column({ type: 'jsonb' })
  state: any[];
}
