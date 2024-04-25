import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Audit } from 'src/shared/entities';
import { ContractCatalogStatus } from 'src/shared/enums/contract-catalog-enum';
import { ContractItem } from './contract-item.entity';
import { ContractBeneficiary } from './contract-beneficiary.entity';
@Entity({ name: 'contract_catalogs' })
export class ContractCatalog extends Audit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'jsonb' })
  organization: any;

  @Column({ type: 'jsonb' })
  vendor: any;

  @Column()
  contractReferenceNumber: string;

  @Column()
  contractTitle: string;

  @Column()
  description: string;

  @Column()
  startDate: Date;

  @Column()
  endDate: Date;

  @Column({
    type: 'enum',
    enum: ContractCatalogStatus,
    default: ContractCatalogStatus.Active,
  })
  status: string;

  @OneToMany(
    () => ContractItem,
    (contractItem) => contractItem.contractCatalog,
    {
      cascade: true,
    },
  )
  contractItems: ContractItem[];

  @OneToMany(
    () => ContractBeneficiary,
    (contractBeneficiaries) => contractBeneficiaries.contractCatalog,
    {
      cascade: true,
    },
  )
  contractBeneficiaries: ContractBeneficiary[];
}
