import { Controller } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, ApiTags } from '@nestjs/swagger';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { DataResponseFormat } from '@api-data';
import { ContractCatalog } from '@entities';
import { EntityCrudController } from '@generic-controllers';
import { ContractCatalogsService } from '../services/contract-catalog.service';
import {
  CreateContractCatalogDTO,
  UpdateContractCatalogDTO,
} from '../dto/contract-catalog.dto';

const options: EntityCrudOptions = {
  createDto: CreateContractCatalogDTO,
  updateDto: UpdateContractCatalogDTO,
};
@Controller('contract-catalogs')
@ApiTags('contract-catalogs')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiExtraModels(DataResponseFormat)
export class ContractCatalogsController extends EntityCrudController<ContractCatalog>(
  options,
) {
  constructor(
    private readonly contractCatalogService: ContractCatalogsService,
  ) {
    super(contractCatalogService);
  }
}
