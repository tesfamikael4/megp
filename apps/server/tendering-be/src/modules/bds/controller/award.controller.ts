import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { BdsAward } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BdsAwardService } from '../service/awards.service';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('bds-awards')
@ApiTags('Bds Award Controller')
export class BdsAwardController extends ExtraCrudController<BdsAward>(options) {
  constructor(private readonly BdsAwardService: BdsAwardService) {
    super(BdsAwardService);
  }
}
