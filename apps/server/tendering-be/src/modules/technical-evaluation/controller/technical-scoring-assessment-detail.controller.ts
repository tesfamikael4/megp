import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TechnicalScoringAssessmentDetail } from 'src/entities/technical-scoring-assessment-detail.entity';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { AllowAnonymous } from 'src/shared/authorization';
import { ApiTags } from '@nestjs/swagger';

import { TechnicalScoringAssessmentDetailService } from '../service/technical-scoring-assessment-detail.service';
import { CompleteBidderEvaluationDto } from '../dto/technical-preliminary-assessment.dto';
import { GroupMemberGuard } from 'src/shared/authorization/guards/team-member.guard';
import { TeamRoleEnum } from 'src/shared/enums/team-type.enum';

const options: ExtraCrudOptions = {
  entityIdName: 'technicalScoringAssessmentId',
  // createDto: CreateTechnicalScoringAssessmentDetailDto,
};

@UseGuards(GroupMemberGuard(TeamRoleEnum.TECHNICAL_EVALUATOR))
@Controller('technical-scoring-assessment-detail')
@ApiTags('Technical Scoring Assessment Detail Controller')
export class TechnicalScoringAssessmentDetailController extends ExtraCrudController<TechnicalScoringAssessmentDetail>(
  options,
) {
  constructor(
    private readonly technicalScoringAssessmentDetailService: TechnicalScoringAssessmentDetailService,
  ) {
    super(technicalScoringAssessmentDetailService);
  }

  @Get('get-items-by-lotId/:lotId')
  async getItemsByLotId(
    @Param('lotId') lotId: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.technicalScoringAssessmentDetailService.getItemsByLotId(
      lotId,
      query,
      req,
    );
  }

  // @AllowAnonymous()
  @Get('bidders-status/:lotId')
  async passedBidders(
    @Param('lotId') lotId: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.technicalScoringAssessmentDetailService.passedBidders(
      lotId,
      query,
      req,
    );
  }

  @Get('checklist-status/:lotId/:bidderId')
  async checklistStatus(
    @Param('lotId') lotId: string,
    @Param('bidderId') bidderId: string,
    @Req() req,
  ) {
    return await this.technicalScoringAssessmentDetailService.checklistStatus(
      lotId,
      bidderId,
      req,
    );
  }

  @Get('can-complete/:lotId')
  async canComplete(
    @Param('lotId') lotId: string,
    // @Param('itemId') itemId: string,
    @Req() req,
  ) {
    return await this.technicalScoringAssessmentDetailService.canComplete(
      lotId,
      req,
    );
  }

  // @Put('complete-bidder-evaluation')
  // async completeBidderEvaluation(
  //   @Body() itemData: CompleteBidderEvaluationDto,
  //   @Req() req,
  // ) {
  //   return await this.technicalScoringAssessmentDetailService.completeBidderEvaluation(
  //     itemData,
  //     req,
  //   );
  // }

  @Get('evaluator-report/:lotId/:itemId/:bidderId')
  async evaluatorReport(
    @Param('bidderId') bidderId: string,
    @Param('itemId') itemId: string,
    @Param('lotId') lotId: string,
    @Req() req: any,
  ) {
    return await this.technicalScoringAssessmentDetailService.evaluatorReport(
      lotId,
      itemId,
      bidderId,
      req,
    );
  }

  // @Put('submit-checklist')
  // async submitChecklist(@Body() itemData: any, @Req() req) {
  //   return await this.technicalScoringAssessmentDetailService.submit(
  //     itemData,
  //     req,
  //   );
  // }

  // @Get('members-report/:lotId/:itemId/:bidderId/:eqcEvaluationId')
  // async membersReport(
  //   @Param('lotId') lotId: string,
  //   );
  // }
}
