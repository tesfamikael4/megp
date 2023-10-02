import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UserGroup } from './user-group.entity';

@Entity({ name: 'groups' })
export class Group {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;


  @OneToMany(
    () => UserGroup,
    (userGroups) => userGroups.group,
    {
      cascade: true,
      onDelete: "CASCADE"
    },
  )
  userGroups: UserGroup[];
}
