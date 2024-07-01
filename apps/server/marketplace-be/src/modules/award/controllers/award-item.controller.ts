import { Body, Controller, Param, Patch } from '@nestjs/common';
import { CurrentUser, ExtraCrudController } from 'megp-shared-be';
import { ApiTags } from '@nestjs/swagger';
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
