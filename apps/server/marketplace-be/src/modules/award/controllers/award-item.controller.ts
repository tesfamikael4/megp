import { Body, Controller, Get, Param, Patch, Query } from '@nestjs/common';
import {
  CurrentUser,
  ExtraCrudController,
  decodeCollectionQuery,
} from 'megp-shared-be';
import { ApiQuery, ApiTags } from '@nestjs/swagger';
import { AwardItem } from 'src/entities';
import { AwardItemService } from '../services/award-item.service';
import {
  CreateAwardItemDTO,
  RespondAwardItemDto,
  UpdateAwardItemDto,
} from '../dtos/award-item.dto';

const option = {
  entityIdName: 'awardNoteId',
  createDto: CreateAwardItemDTO,
  updateDto: UpdateAwardItemDto,
};

@Controller('award-items')
@ApiTags('Award Items')
export class AwardItemController extends ExtraCrudController<AwardItem>(
  option,
) {
  constructor(private readonly awardItemService: AwardItemService) {
    super(awardItemService);
  }

  @Get('awarded-vendors/:rfxId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getAwardedVendors(
    @Param('rfxId') rfxId: string,
    @CurrentUser() user: any,
    @Query('q') q?: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.awardItemService.awardedVendors(rfxId, user, query);
  }

  @Get('my-award-items/:rfxId')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getMyAwardItems(
    @Param('rfxId') rfxId: string,
    @CurrentUser() user: any,
    @Query('q') q?: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.awardItemService.myAwardItem(rfxId, user, query);
  }

  @Patch('respond-award/:awardItemId')
  async respondAward(
    @Param('awardItemId') awardItemId: string,
    @CurrentUser() user: any,
    @Body() respondAwardDto: RespondAwardItemDto,
  ) {
    return await this.awardItemService.respondAward(
      awardItemId,
      respondAwardDto.status,
      user,
    );
  }
}
