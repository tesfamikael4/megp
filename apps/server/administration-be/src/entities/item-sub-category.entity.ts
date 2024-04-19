import { Audit } from 'src/shared/entities';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum ParentCategory {
  Goods = 'Goods',
  Service = 'Service',
  Work = 'Work',
}

@Entity({ name: 'item_sub_categories' })
export class ItemSubCategory extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  description: string;

  @Column({ type: 'enum', enum: ParentCategory })
  parentCategories: string;
}
