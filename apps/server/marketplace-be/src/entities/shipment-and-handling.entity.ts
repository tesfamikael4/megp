import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ItemShipment } from './item-shipment.entity';
import { Audit } from 'megp-shared-be';

@Entity({ name: 'shipment_and_handlings' })
export class ShipmentAndHandlings extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  itemShipmentId: string;

  @Column({ type: 'uuid' })
  itemId: string;

  @Column()
  amount: string;

  @Column()
  chargeType: string;

  @Column()
  description: string;

  @ManyToOne(
    () => ItemShipment,
    (itemShipment) => itemShipment.shipmentAndHandlings,
  )
  itemShipment: ItemShipment;
}
