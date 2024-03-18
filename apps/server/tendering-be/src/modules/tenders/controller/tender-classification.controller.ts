import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TenderClassification } from 'src/entities/tender-classification.entity';
import { ExtraCrudController } from 'src/shared/controller';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { TenderClassificationService } from '../service/tender-classification.service';

const options: ExtraCrudOptions = {
  entityIdName: 'tenderId',
};

@ApiBearerAuth()
@Controller('tender-classifications')
@ApiTags('Tender Classification Controller')
export class TenderClassificationController extends ExtraCrudController<TenderClassification>(
  options,
) {
  constructor(private readonly tenderSpdService: TenderClassificationService) {
    super(tenderSpdService);
  }
}
