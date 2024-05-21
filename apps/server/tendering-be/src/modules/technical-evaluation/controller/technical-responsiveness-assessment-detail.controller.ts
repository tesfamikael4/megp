import { Body, Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TechnicalResponsivenessAssessmentDetail } from 'src/entities/technical-responsiveness-assessment-detail.entity';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { AllowAnonymous } from 'src/shared/authorization';
import { ApiTags } from '@nestjs/swagger';
import {
  CompleteBidderEvaluationDto,
  CompleteResponsivenessBidderEvaluationDto,
} from '../dto/technical-preliminary-assessment.dto';
import { TechnicalResponsivenessAssessmentDetailService } from '../service/technical-responsiveness-assessment-detail.service';

const options: ExtraCrudOptions = {
  entityIdName: 'technicalResponsivenessAssessmentId',
  // createDto: CreateTechnicalResponsivenessAssessmentDetailDto,
};

@Controller('technical-responsiveness-assessment-detail')
@ApiTags('Technical Responsiveness Assessment Detail Controller')
export class TechnicalResponsivenessAssessmentDetailController extends ExtraCrudController<TechnicalResponsivenessAssessmentDetail>(
  options,
) {
  constructor(
    private readonly technicalResponsivenessAssessmentDetailService: TechnicalResponsivenessAssessmentDetailService,
  ) {
    super(technicalResponsivenessAssessmentDetailService);
  }

  @Get('get-items-by-lotId/:lotId')
  async getItemsByLotId(
    @Param('lotId') lotId: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.technicalResponsivenessAssessmentDetailService.getItemsByLotId(
      lotId,
      query,
      req,
    );
  }

  @Get('bidders-status/:lotId/:itemId/:isTeam')
  async passedBidders(
    @Param('lotId') lotId: string,
    @Param('itemId') itemId: string,
    @Param('isTeam') isTeam: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.technicalResponsivenessAssessmentDetailService.passedBidders(
      lotId,
      itemId,
      isTeam,
      query,
      req,
    );
  }

  @Get('checklist-status/:lotId/:itemId/:bidderId/:isTeam')
  async checklistStatus(
    @Param('lotId') lotId: string,
    @Param('itemId') itemId: string,
    @Param('isTeam') isTeam: string,
    @Param('bidderId') bidderId: string,
    @Req() req,
  ) {
    return await this.technicalResponsivenessAssessmentDetailService.checklistStatus(
      lotId,
      itemId,
      bidderId,
      isTeam,
      req,
    );
  }

  @Get('can-complete/:lotId')
  async canComplete(
    @Param('lotId') lotId: string,
    // @Param('itemId') itemId: string,
    @Req() req,
  ) {
    return await this.technicalResponsivenessAssessmentDetailService.canComplete(
      lotId,
      req,
    );
  }

  @Put('complete-bidder-evaluation')
  async completeBidderEvaluation(
    @Body() itemData: CompleteResponsivenessBidderEvaluationDto,
    @Req() req,
  ) {
    return await this.technicalResponsivenessAssessmentDetailService.completeBidderEvaluation(
      itemData,
      req,
    );
  }

  @Get('evaluator-report/:lotId/:itemId/:bidderId/:isTeam')
  async evaluatorReport(
    @Param('bidderId') bidderId: string,
    @Param('itemId') itemId: string,
    @Param('lotId') lotId: string,
    @Param('isTeam') isTeam: string,
    @Req() req: any,
  ) {
    return await this.technicalResponsivenessAssessmentDetailService.evaluatorReport(
      lotId,
      itemId,
      bidderId,
      isTeam,
      req,
    );
  }

  @Put('submit-checklist')
  async submitChecklist(@Body() itemData: any, @Req() req) {
    return await this.technicalResponsivenessAssessmentDetailService.submit(
      itemData,
      req,
    );
  }

  @Get('members-report/:lotId/:itemId/:bidderId/:eqcEvaluationId')
  async membersReport(
    @Param('lotId') lotId: string,
    @Param('itemId') itemId: string,
    @Param('bidderId') bidderId: string,
    @Param('eqcEvaluationId') eqcEvaluationId: string,
  ) {
    return await this.technicalResponsivenessAssessmentDetailService.membersReport(
      eqcEvaluationId,
      bidderId,
      lotId,
      itemId,
    );
  }
}
