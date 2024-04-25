import { Controller, Get, Param, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TechnicalPreliminaryAssessment } from 'src/entities/technical-preliminary-assessment.entity';
import { TechnicalPreliminaryAssessmentService } from '../service/technical-preliminary-assessment.service';
import { CreatePreliminaryAssessment } from '../dto/technical-preliminary-assessment.dto';

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

  @Get('opening-passed-bidders/:lotId')
  async openingPassedBidders(
    @Param('lotId') lotId: string,
    @Req() req,
    @Query('q') q: string,
  ) {
    return await this.technicalPreliminaryAssessmentService.openingPassedBidders(
      lotId,
      q,
      req,
    );
  }
}
