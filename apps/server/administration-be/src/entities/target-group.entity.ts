import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from 'src/shared/entities';

@Entity({ name: 'target_groups' })
export class TargetGroup extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  name: string;
  @Column()
  description: string;
}
