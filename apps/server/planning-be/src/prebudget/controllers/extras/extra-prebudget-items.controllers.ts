import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudDecorator } from 'src/shared/decorators/crud-options.decorator';
import { ExtraCrudController } from 'src/shared/controller/extra-crud.controller';
import { PrebudgetPlanItem } from '../../entities/prebudget-item.entity';
import { ExtraPrebudgetItemsService } from '../../services/extras/extra-prebudget-items.service';

@ExtraCrudDecorator({
  entityIdName: 'prebudgetId',
})
@Controller('extra-prebudget-items')
@ApiTags('Extra Prebudget Item')
export class ExtraPrebudgetItemsController extends ExtraCrudController<PrebudgetPlanItem> {
  constructor(
    private readonly prebudgetItemsService: ExtraPrebudgetItemsService,
  ) {
    super(prebudgetItemsService);
  }
}
