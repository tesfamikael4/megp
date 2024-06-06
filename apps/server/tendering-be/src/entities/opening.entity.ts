import { OrgAudit } from 'src/shared/entities';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Tender } from './tender.entity';
import { Team } from './team.entity';
import { OpeningStatusEnum } from 'src/shared/enums/opening.enum';

@Entity({ name: 'openings' })
export class Opening extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column('uuid')
  // tenderId: string;

  // @OneToOne(() => Tender, (tender) => tender.opening)
  // @JoinColumn({ name: 'tenderId' })
  // tender: Tender;

  // @Column('uuid')
  // teamId: string;

  // @OneToOne(() => Team, (team) => team.opening)
  // @JoinColumn({ name: 'teamId' })
  // team: Team;

  @Column()
  openingType: string;

  @Column({
    type: 'enum',
    enum: OpeningStatusEnum,
    default: OpeningStatusEnum.PENDING,
  })
  status: string;

  @Column({ type: 'boolean', default: false })
  isReportReady: boolean;
}
