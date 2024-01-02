import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Audit } from 'src/shared/entities';
import { Region } from './region.entity';

@Entity({ name: 'districts' })
export class District extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  name: string;
  @Column()
  regionId: string;
  @ManyToOne(() => Region, (region) => region.districts)
  @JoinColumn({ name: 'regionId' })
  region: Region;
}
