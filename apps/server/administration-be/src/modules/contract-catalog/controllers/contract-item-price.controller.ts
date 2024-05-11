import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ContractItemPrice } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ContractItemPricesService } from '../services/contract-item.service';
import {
  CreateContractItemPriceDto,
  UpdateContractItemPriceDto,
} from '../dto/contract-item-price.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'contractItemId',
  createDto: CreateContractItemPriceDto,
  updateDto: UpdateContractItemPriceDto,
};

@Controller('contract-item-prices')
@ApiTags('contract-item-prices')
export class ContractItemPriceController extends ExtraCrudController<ContractItemPrice>(
  options,
) {
  constructor(
    private readonly contractItemPriceService: ContractItemPricesService,
  ) {
    super(contractItemPriceService);
  }
}
