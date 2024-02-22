import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EqcPreliminaryExamination } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { EqcPreliminaryExaminationService } from '../service/preliminary-examination.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
};

@ApiBearerAuth()
@Controller('eqc-preliminary-examinations')
@ApiTags('Eqc Preliminary Examination Controller')
export class EqcPreliminaryExaminationController extends ExtraCrudController<EqcPreliminaryExamination>(
  options,
) {
  constructor(
    private readonly eqcPreliminaryExaminationService: EqcPreliminaryExaminationService,
  ) {
    super(eqcPreliminaryExaminationService);
  }
}
