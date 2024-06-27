import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import {
  ExtraCrudOptions,
  ExtraCrudController,
  JwtGuard,
  decodeCollectionQuery,
  CurrentUser,
} from 'megp-shared-be';
import { SolRoundAward } from 'src/entities';
import { SolRoundAwardService } from '../services/round-award.service';

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
  constructor(private readonly rfxResponseItemService: SolRoundAwardService) {
    super(rfxResponseItemService);
  }

  @Get('my-awards')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getMyAwards(@CurrentUser() user: any, @Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.rfxResponseItemService.getMyAwardedRfxes(user, query);
  }

  @Get('winner/:rfxItemId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getWinner(
    @Param('rfxItemId') rfxItemId: string,
    @Query('q') q?: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.rfxResponseItemService.getAwardWinner(rfxItemId, query);
  }

  @Get('round-winner/:rfxItemId/:round')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getRoundWinner(
    @Param('rfxItemId') rfxItemId: string,
    @Param('round') round: number,
    @Query('q') q?: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.rfxResponseItemService.listResult(
      rfxItemId,
      round,
      query,
    );
  }
}
