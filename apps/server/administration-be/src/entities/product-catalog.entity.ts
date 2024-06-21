import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { Audit } from 'src/shared/entities';
import { ItemMaster } from './item-master.entity';
import { SpecificationTemplate } from './specification-template.entity';
import { ProductCatalogImage } from './product-catalog-image.entity';
import {
  ProductCatalogApprovalStatus,
  ProductCatalogStatus,
} from 'src/shared/enums/product-catalog-enum';
import { ProductCatalogDelivery } from './product-catalog-delivery.entity';

@Entity({ name: 'product_catalogs' })
export class ProductCatalog extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ nullable: true })
  description: string;

  @Column({ type: 'uuid' })
  itemMasterId: string;

  @Column({ type: 'uuid' })
  vendorId: string;

  @Column()
  vendorName: string;

  @Column({ type: 'uuid' })
  specificationTemplateId: string;

  @Column({ type: 'jsonb' })
  specificationValues: any[];

  @Column({ type: 'jsonb', nullable: true, default: [] })
  specifications: any[];

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  quantity: number;

  @Column({
    type: 'enum',
    enum: ProductCatalogStatus,
    default: ProductCatalogStatus.Active,
  })
  status: string;

  @Column({
    type: 'enum',
    enum: ProductCatalogApprovalStatus,
    default: ProductCatalogApprovalStatus.Submitted,
  })
  approvalStatus: string;

  @ManyToOne(() => ItemMaster, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'itemMasterId' })
  itemMaster: ItemMaster;

  @ManyToOne(
    () => SpecificationTemplate,
    (specificationTemplate) => specificationTemplate.productCatalogs,
    {
      onDelete: 'SET NULL',
      onUpdate: 'CASCADE',
      orphanedRowAction: 'delete',
    },
  )
  @JoinColumn({ name: 'specificationTemplateId' })
  specificationTemplate: SpecificationTemplate;

  @OneToMany(
    () => ProductCatalogImage,
    (productCatalogImages) => productCatalogImages.productCatalog,
    {
      cascade: true,
    },
  )
  productCatalogImages: ProductCatalogImage[];

  @OneToMany(
    () => ProductCatalogDelivery,
    (productCatalogDeliveries) => productCatalogDeliveries.productCatalog,
    {
      cascade: true,
    },
  )
  productCatalogDeliveries: ProductCatalogDelivery[];
}
