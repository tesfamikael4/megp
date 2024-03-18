import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenderParticipationFee } from 'src/entities/tender-participation-fee.entity';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TenderParticipationFeeService } from '../service/tender-participation-fee.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('tender-participation-fees')
@ApiTags('Tender ParticipationFee Controller')
export class TenderParticipationFeeController extends ExtraCrudController<TenderParticipationFee>(
  options,
) {
  constructor(
    private readonly tenderSpdService: TenderParticipationFeeService,
  ) {
    super(tenderSpdService);
  }
}
