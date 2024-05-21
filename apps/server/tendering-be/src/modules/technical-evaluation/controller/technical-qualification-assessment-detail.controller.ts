import { Body, Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TechnicalQualificationAssessmentDetailService } from '../service/technical-qualification-assessment-detail.service';
import { TechnicalQualificationAssessmentDetail } from 'src/entities/technical-qualification-assessment-detail.entity';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { AllowAnonymous } from 'src/shared/authorization';
import { ApiTags } from '@nestjs/swagger';
import { CompleteBidderEvaluationDto } from '../dto/technical-preliminary-assessment.dto';

const options: ExtraCrudOptions = {
  entityIdName: 'technicalQualificationAssessmentId',
  // createDto: CreateTechnicalQualificationAssessmentDetailDto,
};

@Controller('technical-qualification-assessment-detail')
@ApiTags('Technical Qualification Assessment Detail Controller')
export class TechnicalQualificationAssessmentDetailController extends ExtraCrudController<TechnicalQualificationAssessmentDetail>(
  options,
) {
  constructor(
    private readonly technicalQualificationAssessmentDetailService: TechnicalQualificationAssessmentDetailService,
  ) {
    super(technicalQualificationAssessmentDetailService);
  }

  @Get('bidders-status/:lotId/:isTeam')
  async openingPassedBidders(
    @Param('lotId') lotId: string,
    @Param('isTeam') isTeam: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.technicalQualificationAssessmentDetailService.openingPassedBidders(
      lotId,
      isTeam,
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
    return await this.technicalQualificationAssessmentDetailService.checklistStatus(
      lotId,
      bidderId,
      isTeam,
      req,
    );
  }

  @Get('can-complete/:lotId')
  async canComplete(@Param('lotId') lotId: string, @Req() req) {
    return await this.technicalQualificationAssessmentDetailService.canComplete(
      lotId,
      req,
    );
  }

  @Put('complete-bidder-evaluation')
  async completeBidderEvaluation(
    @Body() itemData: CompleteBidderEvaluationDto,
    @Req() req,
  ) {
    return await this.technicalQualificationAssessmentDetailService.completeBidderEvaluation(
      itemData,
      req,
    );
  }

  @Get('evaluator-report/:lotId/:bidderId/:isTeam')
  async evaluatorReport(
    @Param('bidderId') bidderId: string,
    @Param('lotId') lotId: string,
    @Param('isTeam') isTeam: string,
    @Req() req: any,
  ) {
    return await this.technicalQualificationAssessmentDetailService.evaluatorReport(
      lotId,
      bidderId,
      isTeam,
      req,
    );
  }

  @Put('submit-checklist')
  async submitChecklist(@Body() itemData: any, @Req() req) {
    return await this.technicalQualificationAssessmentDetailService.submit(
      itemData,
      req,
    );
  }

  @Get('members-report/:lotId/:bidderId/:eqcQualificationId')
  async membersReport(
    @Param('lotId') lotId: string,
    @Param('bidderId') bidderId: string,
    @Param('eqcQualificationId') eqcQualificationId: string,
  ) {
    return await this.technicalQualificationAssessmentDetailService.membersReport(
      eqcQualificationId,
      bidderId,
      lotId,
    );
  }
}
