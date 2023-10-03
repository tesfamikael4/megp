import { CommonEntity } from 'src/shared/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'ncic' })
export class NCICEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  tinNumber: string;
  @Column({ type: 'json' })
  metadata: JSON;
}
