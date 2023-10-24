import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Group } from './group.entity';
import { User } from '../../organization/entities/user.entity';

@Entity({ name: 'user_groups' })
export class UserGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;
  @Column({ nullable: true })
  userName: string;
  @Column({ nullable: true })
  groupName: string;

  @ManyToOne(() => User, (user) => user.userGroups)
  @JoinColumn({ name: 'userId' })
  public user: User;

  @Column()
  groupId: string;

  @ManyToOne(() => Group, (group) => group.userGroups)
  @JoinColumn({ name: 'groupId' })
  public group: Group;
}
