import { Controller, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import {
  ExtraCrudOptions,
  ExtraCrudController,
  JwtGuard,
} from 'megp-shared-be';
import { SolRoundAward } from 'src/entities';
import { SolRoundAwardService } from '../services/round-award.service';
// import { VendorGuard } from 'megp-shared-be/src/authorization/guards/vendor.guard';

const options: ExtraCrudOptions = {
  entityIdName: 'rfxItemId',
};

@ApiBearerAuth()
@Controller('sol-round-awards')
@ApiTags('Sol Round Awards')
// @UseGuards(JwtGuard, VendorGuard())
export class SolRoundAwardController extends ExtraCrudController<SolRoundAward>(
  options,
) {
  constructor(private readonly rfxRepsonseItemService: SolRoundAwardService) {
    super(rfxRepsonseItemService);
  }
}
