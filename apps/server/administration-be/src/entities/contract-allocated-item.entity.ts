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
import { ContractBeneficiary } from './contract-beneficiary.entity';
@Entity({ name: 'contract_allocated_items' })
export class ContractAllocatedItem extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  contractItemId: string;

  @Column({ type: 'uuid' })
  contractBeneficiaryId: string;

  @Column({ type: 'uuid' })
  itemMasterId: string;

  @Column()
  maximumQuantity: number;

  @Column({ default: 0 })
  utilizedQuantity: number;

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

  @ManyToOne(
    () => ContractBeneficiary,
    (contractBeneficiary) => contractBeneficiary.contractAllocatedItems,
  )
  @JoinColumn({ name: 'contractBeneficiaryId' })
  public contractBeneficiary: ContractBeneficiary;
}
