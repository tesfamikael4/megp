import { Body, Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { TechnicalEndorsementService } from '../service/technical-endorsement.service';
import { EventPattern } from '@nestjs/microservices';

@Controller('technical-endorsement')
@ApiTags('Technical Endorsement Controller')
export class TechnicalEndorsementController {
  constructor(
    private readonly technicalEndorsementService: TechnicalEndorsementService,
  ) {}

  @Get('get-lots')
  async openedTenders(@Query('q') q: string, @Req() req) {
    const query = decodeCollectionQuery(q);
    return await this.technicalEndorsementService.getLots(query, req);
  }

  @EventPattern('tendering-workflow.TechnicalEndorsementApproval')
  async handleApprovedWorkflow(@Body() data: any) {
    return await this.technicalEndorsementService.endorsementResult(data);
  }
  @EventPattern('tendering-workflow.FinancialEndorsementApproval')
  async handleFinancialApprovedWorkflow(@Body() data: any) {
    return await this.technicalEndorsementService.endorsementResult(data);
  }
}
