import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserGroup } from './user-group.entity';

@Entity({ name: 'group_news' })
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'jsonb', nullable: true })
  descriptionJson: any;

  @OneToMany(() => UserGroup, (userGroups) => userGroups.group, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userGroups: UserGroup[];
}
