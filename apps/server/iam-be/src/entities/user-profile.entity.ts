import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';

import { User } from './user.entity';

@Entity({ name: 'user_profiles' })
export class UserProfile extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'jsonb' })
  extendedProfile: JSON;
  @Column()
  userId: string;
  @OneToOne(() => User, (emp) => emp.userProfile, {
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'userId' })
  user: User;
}
