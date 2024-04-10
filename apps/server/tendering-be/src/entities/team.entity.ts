import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
  Unique,
} from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { Lot } from './lot.entity';
import { Opening } from './opening.entity';
import { TeamMember } from './team-member.entity';
import { EnvelopTypeEnum } from 'src/shared/enums';
import { TeamRoleEnum } from 'src/shared/enums/team-type.enum';

@Unique(['lotId', 'teamType'])
@Entity({ name: 'teams' })
export class Team extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  lotId: string;

  @ManyToOne(() => Lot, (lot) => lot.team)
  @JoinColumn({ name: 'lotId' })
  lots: Lot;

  @OneToOne(() => Opening, (opening) => opening.team)
  opening: Opening;

  @OneToMany(() => TeamMember, (teamMember) => teamMember.team)
  teamMembers: TeamMember[];

  @Column({
    type: 'enum',
    enum: EnvelopTypeEnum,
  })
  envelopeType: string;

  @Column({
    type: 'enum',
    enum: TeamRoleEnum,
  })
  teamType: string;

  @Column('int')
  memberLimit: number;
}
