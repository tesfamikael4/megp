import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { ItemMaster } from './item-master.entity';
import { ProductCatalog } from './product-catalog.entity';

@Entity({ name: 'specification_templates' })
export class SpecificationTemplate extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  itemMasterId: string;

  @Column({ nullable: true })
  itemMasterCode: string;

  @Column({ type: 'numeric', precision: 14, scale: 2, default: 0 })
  quantity: number;

  @Column({ type: 'jsonb' })
  properties: any[];

  @Column({ type: 'jsonb' })
  deliveries: any[];

  @OneToOne(() => ItemMaster, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE',
    orphanedRowAction: 'delete',
  })
  @JoinColumn({ name: 'itemMasterId' })
  itemMaster: ItemMaster;

  @OneToMany(
    () => ProductCatalog,
    (productCatalogs) => productCatalogs.specificationTemplate,
    {
      cascade: true,
    },
  )
  productCatalogs: ProductCatalog[];
}
