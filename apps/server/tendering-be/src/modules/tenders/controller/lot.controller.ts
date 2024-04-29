import { Body, Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Lot } from 'src/entities';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { LotService } from '../service/lot.service';
import { SplitItemDto } from '../dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('lots')
@ApiTags('Lot Controller')
export class LotController extends ExtraCrudController<Lot>(options) {
  constructor(private readonly lotService: LotService) {
    super(lotService);
  }

  @Post('split-items')
  async splitItems(@Body() itemData: SplitItemDto, @Req() req?: any) {
    return this.lotService.splitItems(itemData, req);
  }

  @Get('assigned-lots')
  async getAssignedLot(
    @Param('tenderId') tenderId: string,
    @Query() q: string,
    @Req() req?: any,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.lotService.getAssignedLot(tenderId, query, req);
  }
}
