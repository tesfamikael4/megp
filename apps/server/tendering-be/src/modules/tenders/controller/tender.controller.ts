import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Tender } from 'src/entities';
import { EntityCrudController } from 'src/shared/controller';
import { EntityCrudOptions } from 'src/shared/types/crud-option.type';
import { TenderService } from '../service/tender.service';
import { CreateTenderDto } from '../dto/tender.dto';
import { AllowAnonymous } from 'src/shared/authorization';

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
}
