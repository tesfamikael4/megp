import { SorIncidentalCost } from 'src/entities/sor-incidental-cost.entity';
import { ExtraCrudController } from 'src/shared/controller';
import { SorIncidentalCostService } from '../service/sor-incidental-cost.service';
import {
  CreateSorIncidentalCostDto,
  UpdateSorIncidentalCostDto,
} from '../dto/sor-incidental-costs.dto';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { Controller } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

const options: ExtraCrudOptions = {
  entityIdName: 'itemId',
  createDto: CreateSorIncidentalCostDto,
  updateDto: UpdateSorIncidentalCostDto,
};

@ApiBearerAuth()
@Controller('sor-incidental-costs')
@ApiTags('Sor Incidental Costs Controller')
export class SorIncidentalCostController extends ExtraCrudController<SorIncidentalCost>(
  options,
) {
  constructor(
    private readonly sorIncidentalCostService: SorIncidentalCostService,
  ) {
    super(sorIncidentalCostService);
  }
}
