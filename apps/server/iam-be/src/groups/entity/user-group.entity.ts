import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Group } from './group.entity';
import { User } from 'src/organization/entities/user.entity';

@Entity({ name: 'user_groups' })
export class UserGroup {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.userGroups)
  @JoinColumn({ name: 'userId' })
  public user: User;


  @Column()
  groupId: string;

  @ManyToOne(() => Group, (group) => group.userGroups)
  @JoinColumn({ name: 'groupId' })
  public group: Group;
}
