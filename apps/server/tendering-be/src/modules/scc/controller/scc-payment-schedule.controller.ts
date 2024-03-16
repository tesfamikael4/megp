import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SccPaymentSchedule } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SccPaymentScheduleService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('scc-payment-schedules')
@ApiTags('Scc Payment Schedule Controller')
export class SccPaymentScheduleController extends ExtraCrudController<SccPaymentSchedule>(
  options,
) {
  constructor(
    private readonly sccPaymentScheduleService: SccPaymentScheduleService,
  ) {
    super(sccPaymentScheduleService);
  }
}
