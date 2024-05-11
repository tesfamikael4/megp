import { Injectable } from '@nestjs/common';
import { ContractBeneficiary } from '@entities';
import { ExtraCrudService } from '@generic-services';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BulkCreateContractBeneficiaryDto } from '../dto/contract-beneficiery.dto';

@Injectable()
export class ContractBeneficiariesService extends ExtraCrudService<ContractBeneficiary> {
  constructor(
    @InjectRepository(ContractBeneficiary)
    private readonly contractBeneficiaryRepository: Repository<ContractBeneficiary>,
  ) {
    super(contractBeneficiaryRepository);
  }
  async bulkCreate(
    contractBeneficiaries: BulkCreateContractBeneficiaryDto,
  ) {
    await this.contractBeneficiaryRepository.delete({
      contractCatalogId: contractBeneficiaries.contractCatalogId,
    });

    const result = contractBeneficiaries.organizations.map((x) => ({
      contractCatalogId: contractBeneficiaries.contractCatalogId,
      organization: x,
    }));
    await this.contractBeneficiaryRepository.insert(
      this.contractBeneficiaryRepository.create(result),
    );
    return result;
  }

}
