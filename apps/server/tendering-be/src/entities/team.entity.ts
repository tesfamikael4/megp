import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { OrgAudit } from 'src/shared/entities';

@Entity({ name: 'teams' })
export class Team extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(type => User, user => user.teams)
  // teamLeader: User;

  // @ManyToOne(type => Lot, lot => lot.teams)
  // lot: Lot;

  @Column('uuid')
  lotId: string;

  @Column('int')
  envelopeType: number;

  @Column('int')
  teamType: number;

  @Column('int')
  memberLimit: number;
}
