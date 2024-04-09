import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { Lot } from './lot.entity';
import { Opening } from './opening.entity';
import { TeamMember } from './team-member.entity';

@Entity({ name: 'teams' })
export class Team extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('uuid')
  lotId: string;

  @OneToOne(() => Lot, (lot) => lot.team)
  @JoinColumn({ name: 'lotId' })
  lots: Lot;

  @OneToOne(() => Opening, (opening) => opening.team)
  opening: Opening;

  @OneToMany(() => TeamMember, (teamMember) => teamMember.team)
  teamMembers: TeamMember[];

  @Column('int')
  envelopeType: number;

  @Column('int')
  teamType: number;

  @Column('int')
  memberLimit: number;
}
