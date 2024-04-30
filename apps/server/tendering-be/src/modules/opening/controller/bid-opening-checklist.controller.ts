import { Body, Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { BidOpeningChecklist } from 'src/entities';
import { BidOpeningChecklistService } from '../service/bid-opening-checklist.service';
import {
  CreateBidOpeningCheckList,
  SubmitChecklistDto,
} from '../dto/bid-opening-checklist.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { AllowAnonymous } from 'src/shared/authorization';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  createDto: CreateBidOpeningCheckList,
};

@Controller('bid-opening-checklist')
@ApiTags('Bid opening checklist Controller')
export class BidOpeningChecklistController extends ExtraCrudController<BidOpeningChecklist>(
  options,
) {
  constructor(
    private readonly bidOpeningChecklistService: BidOpeningChecklistService,
  ) {
    super(bidOpeningChecklistService);
  }
  @Get('checklist-status/:lotId/:bidderId/:isTeam')
  async checklistStatus(
    @Param('lotId') lotId: string,
    @Param('isTeam') isTeam: string,
    @Param('bidderId') bidderId: string,
    @Req() req,
  ) {
    return await this.bidOpeningChecklistService.checklistStatus(
      lotId,
      bidderId,
      isTeam,
      req,
    );
  }

  @Get('bidders-status/:lotId/:isTeam')
  async openingStatus(
    @Param('lotId') lotId: string,
    @Param('isTeam') isTeam: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.bidOpeningChecklistService.biddersStatus(
      lotId,
      isTeam,
      query,
      req,
    );
  }

  @Put('submit-checklist')
  async submitChecklist(@Body() itemData: SubmitChecklistDto, @Req() req) {
    return await this.bidOpeningChecklistService.submit(itemData, req);
  }

  @Get('can-complete/:tenderId')
  async canComplete(@Param('tenderId') tenderId: string, @Req() req) {
    return await this.bidOpeningChecklistService.canComplete(tenderId, req);
  }

  @Get('members-report/:lotId/:bidderId/spdId')
  async membersReport(
    @Param('lotId') lotId: string,
    @Param('bidderId') bidderId: string,
    @Param('spdId') spdId: string,
  ) {
    return await this.bidOpeningChecklistService.membersReport(
      spdId,
      bidderId,
      lotId,
    );
  }

  @AllowAnonymous()
  @Get('opening-minutes/:tenderId')
  async openingMinutes(@Param('tenderId') tenderId: string) {
    return await this.bidOpeningChecklistService.openingMinutes(tenderId);
  }
}
