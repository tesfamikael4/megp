import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BdsPreparation } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BdsPreparationService } from '../service/preparation.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('bds-preparations')
@ApiTags('Bds Preparation Controller')
export class BdsPreparationController extends ExtraCrudController<BdsPreparation>(
  options,
) {
  constructor(private readonly bdsPreparationService: BdsPreparationService) {
    super(bdsPreparationService);
  }
}
