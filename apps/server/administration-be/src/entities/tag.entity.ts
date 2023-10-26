import { CommonEntity } from 'src/shared/entities/common.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemTag } from './item-tag.entity';
@Entity({ name: 'tags' })
export class Tag extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @OneToMany(() => ItemTag, (entity) => entity.tag)
  itemTags: ItemTag[];
}
