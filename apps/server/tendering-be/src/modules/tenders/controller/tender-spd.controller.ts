import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenderSpd } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TenderSpdService } from '../service/tender-spd.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('tender-spd')
@ApiTags('Tender Spd Controller')
export class TenderSpdController extends ExtraCrudController<TenderSpd>(
  options,
) {
  constructor(private readonly tenderSpdService: TenderSpdService) {
    super(tenderSpdService);
  }
}
