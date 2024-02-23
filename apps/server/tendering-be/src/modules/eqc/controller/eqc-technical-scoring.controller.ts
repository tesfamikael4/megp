import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EqcTechnicalScoring } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { EqcTechnicalScoringService } from '../service/eqc-technical-scoring.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
};

@ApiBearerAuth()
@Controller('eqc-technical-scorings')
@ApiTags('Eqc Technical Scoring Controller')
export class EqcTechnicalScoringController extends ExtraCrudController<EqcTechnicalScoring>(
  options,
) {
  constructor(
    private readonly eqcTechnicalScoringService: EqcTechnicalScoringService,
  ) {
    super(eqcTechnicalScoringService);
  }
}
