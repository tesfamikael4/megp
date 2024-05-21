import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'taxs' })
export class Tax extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  shortName: string;

  @Column()
  percentage: number;
}
