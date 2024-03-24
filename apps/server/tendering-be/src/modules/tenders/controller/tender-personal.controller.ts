import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TenderPersonal } from 'src/entities';
import { TenderPersonalService } from '../service';
import { CreateTenderPersonalDto } from '../dto';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
  createDto: CreateTenderPersonalDto,
};

@ApiBearerAuth()
@Controller('tender-personals')
@ApiTags('Tender Personal Controller')
export class TenderPersonalController extends ExtraCrudController<TenderPersonal>(
  options,
) {
  constructor(private readonly tenderPersonalService: TenderPersonalService) {
    super(tenderPersonalService);
  }
}
