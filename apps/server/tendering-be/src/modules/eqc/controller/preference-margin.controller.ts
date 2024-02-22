import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { EqcPreferenceMargin } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { EqcPreferenceMarginService } from '../service/preference-margin.service';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
};

@ApiBearerAuth()
@Controller('eqc-preference-margins')
@ApiTags('Eqc Preference Margin Controller')
export class EqcPreferenceMarginController extends ExtraCrudController<EqcPreferenceMargin>(
  options,
) {
  constructor(
    private readonly eqcPreferenceMarginService: EqcPreferenceMarginService,
  ) {
    super(eqcPreferenceMarginService);
  }
}
