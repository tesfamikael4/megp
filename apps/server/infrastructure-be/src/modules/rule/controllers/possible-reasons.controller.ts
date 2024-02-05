import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PossibleReasons } from 'src/entities';
import { PossibleReasonsService } from '../services/possible-service.service';
import { ExtraCrudOptions, ExtraCrudController } from '@megp/shared-be';

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
