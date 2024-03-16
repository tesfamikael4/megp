import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SccLiability } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SccLiabilityService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('scc-liabilities')
@ApiTags('Scc Liability Controller')
export class SccLiabilityController extends ExtraCrudController<SccLiability>(
  options,
) {
  constructor(private readonly sccLiabilityService: SccLiabilityService) {
    super(sccLiabilityService);
  }
}
