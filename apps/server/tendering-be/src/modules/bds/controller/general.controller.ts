import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BdsGeneral } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BdsGeneralService } from '../service/general.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('bds-generals')
@ApiTags('Bds General Controller')
export class BdsGeneralController extends ExtraCrudController<BdsGeneral>(
  options,
) {
  constructor(private readonly BdsGeneralService: BdsGeneralService) {
    super(BdsGeneralService);
  }
}
