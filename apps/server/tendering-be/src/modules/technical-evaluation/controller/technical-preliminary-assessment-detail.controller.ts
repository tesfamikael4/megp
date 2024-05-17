import { Body, Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TechnicalPreliminaryAssessmentDetail } from 'src/entities/technical-preliminary-assessment-detail.entity';
import { TechnicalPreliminaryAssessmentDetailService } from '../service/technical-preliminary-assessment-detail.service';
import {
  CompleteBidderEvaluationDto,
  CreatePreliminaryAssessment,
} from '../dto/technical-preliminary-assessment.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';

const options: ExtraCrudOptions = {
  entityIdName: 'technicalPreliminaryAssessmentId',
  createDto: CreatePreliminaryAssessment,
};

@Controller('technical-preliminary-assessment-detail')
@ApiTags('Technical Preliminary Assessment Detail Controller')
export class TechnicalPreliminaryAssessmentDetailController extends ExtraCrudController<TechnicalPreliminaryAssessmentDetail>(
  options,
) {
  constructor(
    private readonly technicalPreliminaryAssessmentDetailService: TechnicalPreliminaryAssessmentDetailService,
  ) {
    super(technicalPreliminaryAssessmentDetailService);
  }

  @Get('bidders-status/:lotId/:isTeam')
  async openingPassedBidders(
    @Param('lotId') lotId: string,
    @Param('isTeam') isTeam: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.technicalPreliminaryAssessmentDetailService.openingPassedBidders(
      lotId,
      isTeam,
      query,
      req,
    );
  }

  @Get('opened-tenders')
  async openedTenders(@Query('q') q: string, @Req() req) {
    const query = decodeCollectionQuery(q);
    return await this.technicalPreliminaryAssessmentDetailService.openedTenders(
      query,
      req,
    );
  }

  @Get('checklist-status/:lotId/:bidderId/:isTeam')
  async checklistStatus(
    @Param('lotId') lotId: string,
    @Param('isTeam') isTeam: string,
    @Param('bidderId') bidderId: string,
    @Req() req,
  ) {
    return await this.technicalPreliminaryAssessmentDetailService.checklistStatus(
      lotId,
      bidderId,
      isTeam,
      req,
    );
  }

  @Put('submit-checklist')
  async submitChecklist(@Body() itemData: any, @Req() req) {
    return await this.technicalPreliminaryAssessmentDetailService.submit(
      itemData,
      req,
    );
  }

  @Get('can-complete/:lotId')
  async canComplete(@Param('lotId') lotId: string, @Req() req) {
    return await this.technicalPreliminaryAssessmentDetailService.canComplete(
      lotId,
      req,
    );
  }

  @Get('members-report/:lotId/:bidderId/spdId')
  async membersReport(
    @Param('lotId') lotId: string,
    @Param('bidderId') bidderId: string,
    @Param('spdId') spdId: string,
  ) {
    return await this.technicalPreliminaryAssessmentDetailService.membersReport(
      spdId,
      bidderId,
      lotId,
    );
  }
  @Put('complete-bidder-evaluation')
  async completeBidderEvaluation(
    @Body() itemData: CompleteBidderEvaluationDto,
    @Req() req,
  ) {
    return await this.technicalPreliminaryAssessmentDetailService.completeBidderEvaluation(
      itemData,
      req,
    );
  }
}
