import { CommonEntity } from 'src/shared/entities/common.entity';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity({ name: 'trade_registration' })
export class TradeRegistrationDatabaseEntity extends CommonEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ name: 'tin_number' })
  tinNumber: string;
  @Column({ name: 'metadata', type: 'json' })
  metadata: JSON;
}
