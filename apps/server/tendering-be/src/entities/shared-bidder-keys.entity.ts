import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity({ name: 'shared_bidder_keys' })
export class SharedBidderKey {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // @ManyToOne(type => Bidder, bidder => bidder.sharedBidderKeys)
  // bidder: Bidder;

  // @ManyToOne(type => Lot, lot => lot.sharedBidderKeys)
  // lot: Lot;

  @Column('uuid')
  lotId: string;

  @Column('uuid')
  bidderId: string;

  @Column()
  envelopeType: string;

  @Column()
  privateKey: string;

  @Column({ nullable: true })
  contactName: string;

  @Column({ nullable: true })
  contactPhoneNumber: string;

  @Column('timestamp')
  timestamp: Date;
}
