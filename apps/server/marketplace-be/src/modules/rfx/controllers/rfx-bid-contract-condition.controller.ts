import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { RfxBidContractCondition } from 'src/entities';
import { ExtraCrudOptions, ExtraCrudController } from 'megp-shared-be';
import { RfxBidContractConditionService } from '../services/rfx-bid-contract-condition.service';
import {
  CreateRfxBidContractConditionDTO,
  UpdateRfxBidContractConditionDTO,
} from '../dtos/rfx-bid-contract.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxId',
  createDto: CreateRfxBidContractConditionDTO,
  updateDto: UpdateRfxBidContractConditionDTO,
};

@ApiBearerAuth()
@Controller('rfx-bid-contract-conditions')
@ApiTags('Rfx Bid Contract Conditions')
export class RfxBidContractConditionController extends ExtraCrudController<RfxBidContractCondition>(
  options,
) {
  constructor(
    private readonly rfxBidContractConditionService: RfxBidContractConditionService,
  ) {
    super(rfxBidContractConditionService);
  }
}
