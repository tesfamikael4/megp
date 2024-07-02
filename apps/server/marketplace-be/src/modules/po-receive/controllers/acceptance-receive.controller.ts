import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AcceptanceReceive } from 'src/entities';
import { RelationCrudController, RelationCrudOptions } from 'megp-shared-be';
import { AcceptanceReceiveService } from '../services/acceptance-receive.service';
import {
  CreateBulkAcceptanceReceivesDto,
  CreateBulkReceiveAcceptancesDto,
} from '../dtos/acceptance-acceptance.dto';
const options: RelationCrudOptions = {
  firstEntityIdName: 'acceptanceNoteId',
  firstInclude: 'receivingNote',
  secondEntityIdName: 'receivingNoteId',
  secondInclude: 'acceptanceNote',
  assignFirstDto: CreateBulkAcceptanceReceivesDto,
  assignSecondDto: CreateBulkReceiveAcceptancesDto,
};

@ApiBearerAuth()
@Controller('acceptance-receive')
@ApiTags('AcceptanceReceive')
export class AcceptanceReceiveController extends RelationCrudController<AcceptanceReceive>(
  options,
) {
  constructor(
    private readonly acceptanceReceiveService: AcceptanceReceiveService,
  ) {
    super(acceptanceReceiveService);
  }
}
