import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { decodeCollectionQuery } from 'src/shared/collection-query';
import { TechnicalEndorsementService } from '../service/technical-endorsement.service';

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
}
