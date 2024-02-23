import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { EqcDueDiligence } from 'src/entities/eqc-due-diligence.entity';
import { EqcDueDiligenceService } from '../service/eqc-due-diligence.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
};

@ApiBearerAuth()
@Controller('eqc-due-diligences')
@ApiTags('Eqc Due Diligence Controller')
export class EqcDueDiligenceController extends ExtraCrudController<EqcDueDiligence>(
  options,
) {
  constructor(private readonly eqcDueDiligenceService: EqcDueDiligenceService) {
    super(eqcDueDiligenceService);
  }
}
