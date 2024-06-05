import { Audit } from 'src/shared/entities';
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
} from 'typeorm';
import { ProductCatalog } from './product-catalog.entity';

@Entity({ name: 'product_catalog_deliveries' })
export class ProductCatalogDelivery extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  deliverDays: number;

  @Column()
  location: string;

  @Column({ type: 'uuid' })
  productCatalogId: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  quantity: number;

  @ManyToOne(
    () => ProductCatalog,
    (productCatalog) => productCatalog.productCatalogDeliveries,
  )
  @JoinColumn({ name: 'productCatalogId' })
  productCatalog: ProductCatalog;
}
