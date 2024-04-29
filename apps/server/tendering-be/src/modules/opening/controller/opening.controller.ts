import { Controller, Get, Param, Post, Query, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { Opening } from 'src/entities';
import { OpeningService } from '../service/opening.service';
import { CreateOpeningDto } from '../dto/opening.dto';
import { decodeCollectionQuery } from 'src/shared/collection-query';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
  createDto: CreateOpeningDto,
};

@Controller('opening')
@ApiTags('Opening Controller')
export class OpeningController extends ExtraCrudController<Opening>(options) {
  constructor(private readonly openingService: OpeningService) {
    super(openingService);
  }

  @Post('complete/:tenderId')
  async complete(@Param('tenderId') tenderId: string) {
    return await this.openingService.complete({ tenderId });
  }

  @Get('closed-tenders')
  async closedTender(@Query('q') q: string, @Req() req) {
    const query = decodeCollectionQuery(q);
    return await this.openingService.closedTender(query, req);
  }
}
