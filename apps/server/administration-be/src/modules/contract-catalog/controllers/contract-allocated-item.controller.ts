import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ContractAllocatedItem } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ContractAllocatedItemsService } from '../services/contarct-allocated-item.service';
import {
  CreateContractAllocatedItemDto,
  UpdateContractAllocatedItemDto,
} from '../dto/contract-allocated-item.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'contractCatalogId',
  createDto: CreateContractAllocatedItemDto,
  updateDto: UpdateContractAllocatedItemDto,
};

@Controller('contract-allocated-items')
@ApiTags('contract-allocated-items')
export class ContractAllocatedItemController extends ExtraCrudController<ContractAllocatedItem>(
  options,
) {
  constructor(
    private readonly contractAllocatedItemService: ContractAllocatedItemsService,
  ) {
    super(contractAllocatedItemService);
  }
}
