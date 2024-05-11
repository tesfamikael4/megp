import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ContractItem } from 'src/entities';
import { ContractItemsService } from '../services/contract-item-price.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import {
  CreateContractItemDto,
  UpdateContractItemDto,
} from '../dto/contract-item.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'contractCatalogId',
  createDto: CreateContractItemDto,
  updateDto: UpdateContractItemDto,
};

@Controller('contract-items')
@ApiTags('contract-items')
export class ContractItemController extends ExtraCrudController<ContractItem>(
  options,
) {
  constructor(private readonly contractItemService: ContractItemsService) {
    super(contractItemService);
  }
}
