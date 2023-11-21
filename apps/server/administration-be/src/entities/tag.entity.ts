import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ItemTag } from './item-tag.entity';
import { Audit } from 'src/shared/entities';
@Entity({ name: 'tags' })
export class Tag extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @OneToMany(() => ItemTag, (entity) => entity.tag)
  itemTags: ItemTag[];
}
