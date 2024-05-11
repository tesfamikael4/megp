import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ContractBeneficiary } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ContractBeneficiariesService } from '../services/contract-beneficiary.service';
import {
  CreateContractBeneficiaryDto,
  UpdateContractBeneficiaryDto,
} from '../dto/contract-beneficiery.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'contractCatalogId',
  createDto: CreateContractBeneficiaryDto,
  updateDto: UpdateContractBeneficiaryDto,
};

@Controller('contract-beneficiaries')
@ApiTags('contract-beneficiaries')
export class ContractBeneficiaryController extends ExtraCrudController<ContractBeneficiary>(
  options,
) {
  constructor(
    private readonly contractBeneficiaryService: ContractBeneficiariesService,
  ) {
    super(contractBeneficiaryService);
  }

  @Post('bulk-assign')
  async bulkCreate(
    @Body() createContractBeneficiaryDto: any,
  ) {
    return this.contractBeneficiaryService.bulkCreate(createContractBeneficiaryDto);
  }
}
