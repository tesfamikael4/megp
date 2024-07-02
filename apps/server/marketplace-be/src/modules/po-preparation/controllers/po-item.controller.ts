import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController, ExtraCrudOptions } from 'megp-shared-be';
import { POItem } from 'src/entities';
import { POItemService } from '../services/po-item.service';
import { CreatePOItemDto, UpdatePoItemDto } from '../dtos/po-item.dto';
const options: ExtraCrudOptions = {
  entityIdName: 'purchaseOrderId',
  createDto: CreatePOItemDto,
  updateDto: UpdatePoItemDto,
};

@ApiBearerAuth()
@Controller('po-items')
@ApiTags('POItem')
export class POItemController extends ExtraCrudController<POItem>(options) {
  constructor(private readonly poItemService: POItemService) {
    super(poItemService);
  }
}
