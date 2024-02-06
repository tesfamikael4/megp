import { Controller } from '@nestjs/common';
import { ExtraCrudController } from 'src/shared/controller';
import { ApiTags } from '@nestjs/swagger';
import { PossibleReasons } from 'src/entities';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { PossibleReasonsService } from '../services/possible-service.service';

const option: ExtraCrudOptions = {
  entityIdName: 'ruleDesignerId',
};
@Controller('possible-reasons')
@ApiTags('possible-reasons')
export class PossibleReasonsController extends ExtraCrudController<PossibleReasons>(
  option,
) {
  constructor(private readonly rulePossibleService: PossibleReasonsService) {
    super(rulePossibleService);
  }
}
