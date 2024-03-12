import { Controller } from '@nestjs/common';
import { ExtraCrudController } from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
import { PossibleReasons } from 'src/entities';
import { ExtraCrudOptions } from 'megp-shared-be';
import { PossibleReasonsService } from '../services/possible-service.service';

const option: ExtraCrudOptions = {
  entityIdName: 'designerId',
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
