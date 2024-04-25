import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ProductCatalog } from './product-catalog.entity';
@Entity({ name: 'product_catalog_images' })
export class ProductCatalogImage extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  fileInfo: any;

  @Column({ type: 'uuid' })
  productCatalogId: string;

  @ManyToOne(
    () => ProductCatalog,
    (productCatalog) => productCatalog.productCatalogImages,
  )
  @JoinColumn({ name: 'productCatalogId' })
  public productCatalog: ProductCatalog;
}
