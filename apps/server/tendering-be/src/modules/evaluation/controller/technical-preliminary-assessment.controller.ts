import { Body, Controller, Get, Param, Put, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TechnicalPreliminaryAssessment } from 'src/entities/technical-preliminary-assessment.entity';
import { TechnicalPreliminaryAssessmentService } from '../service/technical-preliminary-assessment.service';
import { CreatePreliminaryAssessment } from '../dto/technical-preliminary-assessment.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  createDto: CreatePreliminaryAssessment,
};

@Controller('preliminary-compliance')
@ApiTags('preliminary compliance Controller')
export class TechnicalPreliminaryAssessmentController extends ExtraCrudController<TechnicalPreliminaryAssessment>(
  options,
) {
  constructor(
    private readonly technicalPreliminaryAssessmentService: TechnicalPreliminaryAssessmentService,
  ) {
    super(technicalPreliminaryAssessmentService);
  }

  @Get('bidders-status/:lotId/:isTeam')
  async openingPassedBidders(
    @Param('lotId') lotId: string,
    @Param('isTeam') isTeam: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    const query = decodeCollectionQuery(q);
    return await this.technicalPreliminaryAssessmentService.openingPassedBidders(
      lotId,
      isTeam,
      query,
      req,
    );
  }

  @Get('opened-tenders')
  async openedTenders(@Query('q') q: string, @Req() req) {
    const query = decodeCollectionQuery(q);
    return await this.technicalPreliminaryAssessmentService.openedTenders(
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
    return await this.technicalPreliminaryAssessmentService.checklistStatus(
      lotId,
      bidderId,
      isTeam,
      req,
    );
  }

  @Put('submit-checklist')
  async submitChecklist(@Body() itemData: any, @Req() req) {
    return await this.technicalPreliminaryAssessmentService.submit(
      itemData,
      req,
    );
  }
}
