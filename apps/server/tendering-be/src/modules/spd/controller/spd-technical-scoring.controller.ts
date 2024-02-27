import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EntityCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SpdTechnicalScoring } from 'src/entities';
import {
  CreateSpdTechnicalScoringDto,
  UpdateSpdTechnicalScoringDto,
} from '../dto';
import { SpdTechnicalScoringService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'spdId',
  createDto: CreateSpdTechnicalScoringDto,
  updateDto: UpdateSpdTechnicalScoringDto,
};

@ApiBearerAuth()
@Controller('spd-technical-scoring')
@ApiTags('Spd Technical Scoring')
export class SpdTechnicalScoringController extends EntityCrudController<SpdTechnicalScoring>(
  options,
) {
  constructor(
    private readonly spdTechnicalScoringService: SpdTechnicalScoringService,
  ) {
    super(spdTechnicalScoringService);
  }
}
