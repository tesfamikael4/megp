import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Activity } from './activity.entity';
import { OrgAudit } from 'src/shared/entities/org-audit.entity';
import { Instance } from './instance.entity';

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

  @OneToOne(() => Instance, (instance) => instance.state)
  instance: Instance;
}
