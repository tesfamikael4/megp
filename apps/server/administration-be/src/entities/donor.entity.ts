import { Audit } from 'src/shared/entities';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'donors' })
export class Donor extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  name: string;

  @Column()
  description: string;
}
