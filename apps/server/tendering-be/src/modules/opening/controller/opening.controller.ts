import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { Opening } from 'src/entities';
import { OpeningService } from '../service/opening.service';
import { CreateOpeningDto } from '../dto/opening.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { AllowAnonymous } from 'src/shared/authorization';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
  createDto: CreateOpeningDto,
};

@Controller('opening')
@ApiTags('Opening Controller')
export class OpeningController extends ExtraCrudController<Opening>(options) {
  constructor(private readonly openingService: OpeningService) {
    super(openingService);
  }

  @Post('complete/:tenderId')
  async complete(@Param('tenderId') tenderId: string) {
    return await this.openingService.complete({ tenderId });
  }

  @Get('closed-tenders')
  async closedTender(@Query('q') q: string, @Req() req) {
    const query = decodeCollectionQuery(q);
    return await this.openingService.closedTender(query, req);
  }

  @Get('get-tender-detail/:tenderId')
  @AllowAnonymous()
  async getTenderDetail(@Param('tenderId') tenderId: string) {
    return await this.openingService.getTenderDetails(tenderId);
  }
  @Get('get-lot-detail/:tenderId/:lotId')
  @AllowAnonymous()
  async getLotDetail(
    @Param('tenderId') tenderId: string,
    @Param('lotId') lotId: string,
  ) {
    return await this.openingService.getLotDetails(tenderId, lotId);
  }
  @Get('get-bidder-detail/:tenderId/:lotId/:bidderId')
  @AllowAnonymous()
  async getBidderDetail(
    @Param('tenderId') tenderId: string,
    @Param('lotId') lotId: string,
    @Param('bidderId') bidderId: string,
  ) {
    return await this.openingService.getBidderDetails(
      tenderId,
      lotId,
      bidderId,
    );
  }
}
