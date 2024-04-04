import { OrgAudit } from 'src/shared/entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'bid_opening_checklists' })
export class BidOpeningChecklist extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @Column('uuid')
  // tenderID: string;

  // @Column('uuid')
  // lotID: string;

  // @Column('uuid')
  // bidderId: string;

  // @Column({
  //   type: 'enum',
  //   enum: CHECKED_STATUS_ENUM,
  //   default: CHECKED_STATUS_ENUM.DEFAULT,
  // })
  // checked: string;

  @Column({ nullable: true })
  remark: string;
}
