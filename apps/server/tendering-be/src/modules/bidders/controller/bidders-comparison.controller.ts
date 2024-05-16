import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { BiddersComparison } from 'src/entities/bidders-comparison.entity';

import { BiddersComparisonService } from '../services/bidders-comparison.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'bidRegistrationId',
};

@Controller('bidders-comparison')
@ApiTags('Bidders Comparison Controller')
export class BiddersComparisonController extends ExtraCrudController<BiddersComparison>(
  options,
) {
  constructor(
    private readonly biddersComparisonService: BiddersComparisonService,
  ) {
    super(biddersComparisonService);
  }
}
