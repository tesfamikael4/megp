import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController, ExtraCrudOptions } from 'megp-shared-be';
import { AcceptanceItemService } from '../services/acceptance-item.service';
import {
  CreateAcceptanceItemDto,
  UpdateAcceptanceItemDto,
} from '../dtos/acceptance-item.dto';
import { AcceptanceItem } from 'src/entities';
const options: ExtraCrudOptions = {
  entityIdName: 'acceptanceNoteId',
  createDto: CreateAcceptanceItemDto,
  updateDto: UpdateAcceptanceItemDto,
};

@ApiBearerAuth()
@Controller('acceptance-items')
@ApiTags('AcceptanceItem')
export class AcceptanceItemController extends ExtraCrudController<AcceptanceItem>(
  options,
) {
  constructor(private readonly acceptanceItemService: AcceptanceItemService) {
    super(acceptanceItemService);
  }
}
