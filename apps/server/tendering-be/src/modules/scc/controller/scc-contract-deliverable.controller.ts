import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { SccContractDeliverable } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { SccContractDeliverableService } from '../service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('scc-contract-deliverables')
@ApiTags('Scc Contract Deliverable Controller')
export class SccContractDeliverableController extends ExtraCrudController<SccContractDeliverable>(
  options,
) {
  constructor(
    private readonly sccContractDeliverableService: SccContractDeliverableService,
  ) {
    super(sccContractDeliverableService);
  }
}
