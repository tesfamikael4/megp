import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SccPaymentTerm } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SccPaymentTermService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('scc-payment-terms')
@ApiTags('Scc Payment Term Controller')
export class SccPaymentTermController extends ExtraCrudController<SccPaymentTerm>(
  options,
) {
  constructor(private readonly sccPaymentTermService: SccPaymentTermService) {
    super(sccPaymentTermService);
  }
}
