import { OrgAudit } from 'src/shared/entities';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity({ name: 'bid-securities' })
export class BidSecurity extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  //@Column('uuid')
  // tenderId: string;

  // @Column('uuid')
  // lotId: string;

  // @Column('uuid')
  // bidderId: string;

  @Column({ nullable: true })
  bidSecurityType: string;

  @Column()
  checked: boolean;

  @Column({ nullable: true })
  remark: string;

  @Column({ default: 0, type: 'decimal', precision: 14, scale: 2 })
  amount: number;

  @Column()
  currency: string;

  @Column('Date')
  @Column()
  isChecked: boolean;

  @Column('timestamp')
  timestamp: Date;
}
