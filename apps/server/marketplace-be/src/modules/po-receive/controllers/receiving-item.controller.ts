import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController, ExtraCrudOptions } from 'megp-shared-be';
import { ReceivingItem } from 'src/entities';
import {
  CreateReceivingItemDto,
  UpdateReceivingItemDto,
} from '../dtos/receiving-item.dto';
import { ReceivingItemService } from '../services/receiving-item.service';
const options: ExtraCrudOptions = {
  entityIdName: 'receivingNoteId',
  createDto: CreateReceivingItemDto,
  updateDto: UpdateReceivingItemDto,
};

@ApiBearerAuth()
@Controller('receiving-items')
@ApiTags('ReceivingItem')
export class ReceivingItemController extends ExtraCrudController<ReceivingItem>(
  options,
) {
  constructor(private readonly receivingItemService: ReceivingItemService) {
    super(receivingItemService);
  }
}
