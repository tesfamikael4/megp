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
import { ContractBeneficiaryStatus } from 'src/shared/enums/contract-catalog-enum';
import { ContractAllocatedItem } from './contract-allocated-item.entity';
@Entity({ name: 'contract_beneficiaries' })
export class ContractBeneficiary extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;
  @Column({ type: 'uuid' })
  contractCatalogId: string;

  @Column({ type: 'jsonb' })
  organization: any;

  @Column({
    type: 'enum',
    enum: ContractBeneficiaryStatus,
    default: ContractBeneficiaryStatus.Active,
  })
  status: string;

  @ManyToOne(
    () => ContractCatalog,
    (contractCatalog) => contractCatalog.contractBeneficiaries,
  )
  @JoinColumn({ name: 'contractCatalogId' })
  public contractCatalog: ContractCatalog;

  @OneToMany(
    () => ContractAllocatedItem,
    (contractAllocatedItems) => contractAllocatedItems.contractBeneficiary,
    {
      cascade: true,
    },
  )
  contractAllocatedItems: ContractAllocatedItem[];
}
