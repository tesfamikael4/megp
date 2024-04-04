import { OrgAudit } from 'src/shared/entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'bid_documentary_evidences' })
export class BidDocumentaryEvidence extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(type => Lot, lot => lot.documentaryEvidences)
  // lot: Lot;

  // @ManyToOne(type => Bidder, bidder => bidder.documentaryEvidences)
  // bidder: Bidder;

  // @ManyToOne(type => Evidence, evidence => evidence.documentaryEvidences)
  // evidence: Evidence;

  @Column('boolean')
  checked: boolean;

  @Column('text', { nullable: true })
  remark: string | null;

  @Column('boolean')
  isFirstChecked: boolean;

  @Column('boolean')
  isSecondChecked: boolean;

  @Column('timestamp')
  timestamp: Date;
}
