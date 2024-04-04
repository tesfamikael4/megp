import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { Opening } from 'src/entities';
import { OpeningService } from '../service/opening.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@Controller('opening')
@ApiTags('Opening Controller')
export class OpeningController extends ExtraCrudController<Opening>(options) {
  constructor(private readonly openingService: OpeningService) {
    super(openingService);
  }
}
