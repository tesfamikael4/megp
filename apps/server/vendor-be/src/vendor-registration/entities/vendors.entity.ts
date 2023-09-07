import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ApplicationEntity } from './application.entity';
import { CommonEntity } from 'src/shared/entities/common.entity';
@Entity({ name: 'vendors' })
export class VendorsEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'tin' })
  tin: string;
  @Column({ name: 'vendor_status' })
  status: string;
  //legal form of entity
  @Column({ name: 'form_of_enity' })
  formOfEntity: string;
  @Column({ name: 'country' })
  country: string;
  @Column({ name: 'meta_data', type: 'json' })
  metaData: JSON;

  @OneToMany(() => ApplicationEntity, (app) => app.service)
  applications: ApplicationEntity[];
}
