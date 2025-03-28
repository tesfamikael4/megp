import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { OrgAudit } from 'src/shared/entities';
import { ContractCatalogStatus } from 'src/shared/enums/contract-catalog-enum';
import { ContractItem } from './contract-item.entity';
import { ContractBeneficiary } from './contract-beneficiary.entity';
@Entity({ name: 'contract_catalogs' })
export class ContractCatalog extends OrgAudit {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  vendorId: string;

  @Column()
  vendorName: string;

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
