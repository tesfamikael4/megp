import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemMaster } from './item-master.entity';
import { CommonEntity } from 'src/shared/entities/common.entity';

@Entity({ name: 'item_categories' })
export class ItemCategory extends CommonEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;
    @Column()
    name: string;
    @Column({ type: 'uuid', nullable: true })
    parentId: string;
    @OneToMany(() => ItemMaster, (entity) => entity.itemSubcategory)
    itemMasters: ItemMaster[];
}
