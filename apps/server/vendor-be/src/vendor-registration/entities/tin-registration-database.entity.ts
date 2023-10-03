import { CommonEntity } from 'src/shared/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'tin_registration' })
export class TinRegistrationDatabaseEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column()
  tinNumber: string;
  @Column({ type: 'json' })
  metadata: JSON;
}
