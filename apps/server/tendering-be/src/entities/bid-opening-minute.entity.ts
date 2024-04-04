import { OrgAudit } from 'src/shared/entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'bid_opening_minutes' })
export class BidOpeningMinute extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column('uuid')
  // bidOpeningId: string;

  // @Column('uuid')
  // teamId: Team;

  // @Column('uuid')
  // MemberId: Team;

  // @Column('uuid')
  // personnel: Personnel;

  @Column()
  status: string;

  @Column({ nullable: true })
  remark: string;
}
