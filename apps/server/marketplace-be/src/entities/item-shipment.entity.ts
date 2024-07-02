import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { POItem } from './po-item.entity';
import { ShipmentAndHandlings } from './shipment-and-handling.entity';
import { Audit } from 'megp-shared-be';
import { POShipment } from './po-shipment.entity';

@Entity({ name: 'item_shipments' })
export class ItemShipment extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  poItemId: string;

  @Column({ type: 'uuid' })
  poShipmentId: string;

  @Column()
  itemName: string;

  @Column({ type: 'numeric', default: 0 })
  quantity: number;

  @ManyToOne(() => POItem, (poItem) => poItem.itemShipments)
  @JoinColumn({ name: 'poItemId' })
  poItem: POItem;

  @ManyToOne(() => POShipment, (poShipment) => poShipment.itemShipments)
  @JoinColumn({ name: 'poShipmentId' })
  poShipment: POShipment;

  @OneToMany(
    () => ShipmentAndHandlings,
    (shipmentAndHandling) => shipmentAndHandling.itemShipment,
  )
  shipmentAndHandlings: ShipmentAndHandlings[];
}
