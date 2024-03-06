import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  JoinColumn,
  ManyToOne,
  Unique,
} from 'typeorm';
import { UserGroup } from './user-group.entity';
import { Organization } from '@entities';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'groups' })
@Unique(['name', 'organizationId'])
export class Group extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @OneToMany(() => UserGroup, (userGroups) => userGroups.group, {
    cascade: true,
    onDelete: 'CASCADE',
  })
  userGroups: UserGroup[];

  @Column({ nullable: true })
  organizationId: string;

  @ManyToOne(() => Organization, (organization) => organization)
  @JoinColumn({ name: 'organizationId' })
  public organization: Organization;
}
