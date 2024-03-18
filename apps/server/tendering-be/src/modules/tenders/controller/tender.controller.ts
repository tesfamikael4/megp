import { Controller, Get, Query, Req } from '@nestjs/common';
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Tender } from 'src/entities';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { TenderService } from '../service/tender.service';
import { CreateTenderDto } from '../dto/tender.dto';
import { AllowAnonymous } from 'src/shared/authorization';
import { decodeCollectionQuery } from 'src/shared/collection-query';

const options: EntityCrudOptions = {
  createDto: CreateTenderDto,
};

@ApiBearerAuth()
@Controller('tenders')
@ApiTags('Tender Controller')
@AllowAnonymous()
export class TenderController extends EntityCrudController<Tender>(options) {
  constructor(private readonly tenderService: TenderService) {
    super(tenderService);
  }

  @Get('active-tenders')
  @ApiQuery({
    name: 'q',
    type: String,
    description: 'Collection Query Parameter. Optional',
    required: false,
  })
  async getActiveTenders(@Query('q') q?: string) {
    const query = decodeCollectionQuery(q);
    return await this.tenderService.getActiveTenders(query);
  }
}
