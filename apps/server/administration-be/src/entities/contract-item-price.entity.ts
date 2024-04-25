import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ContractItemStatus } from 'src/shared/enums/contract-catalog-enum';
import { ContractItem } from './contract-item.entity';
@Entity({ name: 'contract_item_prices' })
export class ContractItemPrice extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  contractItemId: string;

  @Column()
  unitPrice: number;

  @Column({ type: 'point' })
  location: string;

  @Column()
  deliveryDate: Date;

  @Column()
  currency: string;

  @Column()
  applicableTax: string;

  @Column({
    type: 'enum',
    enum: ContractItemStatus,
    default: ContractItemStatus.Active,
  })
  status: string;

  @ManyToOne(
    () => ContractItem,
    (contractItem) => contractItem.contractAllocatedItems,
  )
  @JoinColumn({ name: 'contractItemId' })
  public contractItem: ContractItem;
}
