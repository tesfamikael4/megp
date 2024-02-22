import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Tender } from 'src/entities';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { TenderService } from '../service/tender.service';
import { CreateTenderDto } from '../dto/tender.dto';

const options: EntityCrudOptions = {
  createDto: CreateTenderDto,
};

@ApiBearerAuth()
@Controller('tenders')
@ApiTags('Tender Controller')
export class TenderController extends EntityCrudController<Tender>(options) {
  constructor(private readonly tenderService: TenderService) {
    super(tenderService);
  }
}
