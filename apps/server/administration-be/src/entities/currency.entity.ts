import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'currencies' })
export class Currency extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ unique: true })
  name: string;
  @Column()
  description: string;
  @Column({ unique: true })
  abbreviation: string;
}
