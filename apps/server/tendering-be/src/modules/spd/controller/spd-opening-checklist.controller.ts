import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdOpeningChecklist } from 'src/entities';
import {
  CreateSpdOpeningChecklistDto,
  UpdateSpdOpeningChecklistDto,
} from '../dto';
import { SpdOpeningChecklistService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdOpeningChecklistDto,
  updateDto: UpdateSpdOpeningChecklistDto,
};

@ApiBearerAuth()
@Controller('spd-opening-checklists')
@ApiTags('Spd Opening Checklists')
export class SpdOpeningChecklistController extends ExtraCrudController<SpdOpeningChecklist>(
  options,
) {
  constructor(
    private readonly spdOpeningChecklistService: SpdOpeningChecklistService,
  ) {
    super(spdOpeningChecklistService);
  }
}
