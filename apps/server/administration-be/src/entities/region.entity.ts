import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from 'src/shared/entities';
import { District } from './district.entity';

@Entity({ name: 'regions' })
export class Region extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  name: string;
  @OneToMany(() => District, (dist) => dist.region,
    {
      cascade: true,
      onDelete: 'CASCADE',
    },)
  districts: District[];
}
