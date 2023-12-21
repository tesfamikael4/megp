import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdTechnicalScoring } from 'src/entities';
import { SpdTechnicalScoringService } from '../service/spd-technical-scoring.service';
import {
  CreateSpdTechnicalScoringDto,
  UpdateSpdTechnicalScoringDto,
} from '../dto/spd-technical-scoring.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdTechnicalScoringDto,
  updateDto: UpdateSpdTechnicalScoringDto,
};
@ApiBearerAuth()
@Controller('spd-technical-scoring')
@ApiTags('Spd-Technical-Scoring Controller')
export class SpdTechnicalScoringController extends EntityCrudController<SpdTechnicalScoring>(
  options,
) {
  constructor(
    private readonly spdTechnicalScoringServiceBdsService: SpdTechnicalScoringService,
  ) {
    super(spdTechnicalScoringServiceBdsService);
  }
}
