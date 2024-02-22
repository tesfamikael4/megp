import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Lot } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { LotService } from '../service/lot.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('lots')
@ApiTags('Lot Controller')
export class LotController extends ExtraCrudController<Lot>(options) {
  constructor(private readonly lotService: LotService) {
    super(lotService);
  }
}
