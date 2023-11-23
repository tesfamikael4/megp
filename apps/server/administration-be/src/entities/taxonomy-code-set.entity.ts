import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Classification } from './classification.entity';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'taxonomy_code_sets' })
export class TaxonomyCodeSet extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  version: string;

  @OneToMany(
    () => Classification,
    (classification) => classification.taxonomyCodeSet,
  )
  classifications: Classification[];
}
