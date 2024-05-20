import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import { Audit } from 'src/shared/entities/audit.entity';
import { ContractCatalog } from './contract-catalog.entity';
import { ContractItemStatus } from 'src/shared/enums/contract-catalog-enum';
import { ContractAllocatedItem } from './contract-allocated-item.entity';
@Entity({ name: 'contract_items' })
export class ContractItem extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  contractCatalogId: string;

  @Column({ type: 'uuid' })
  itemMasterId: string;

  @Column()
  maximumQuantity: number;

  @Column({ default: 0 })
  utilizedQuantity: number;

  @Column({ type: 'jsonb' })
  specification: any;

  @Column({
    type: 'enum',
    enum: ContractItemStatus,
    default: ContractItemStatus.Active,
  })
  status: string;

  @ManyToOne(
    () => ContractCatalog,
    (contractCatalog) => contractCatalog.contractItems,
  )
  @JoinColumn({ name: 'contractCatalogId' })
  public contractCatalog: ContractCatalog;

  @OneToMany(
    () => ContractAllocatedItem,
    (contractAllocatedItems) => contractAllocatedItems.contractItem,
    {
      cascade: true,
    },
  )
  contractAllocatedItems: ContractAllocatedItem[];
}
