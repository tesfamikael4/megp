import { SorLabor } from 'src/entities/sor-labor.entity';
import { ExtraCrudController } from 'src/shared/controller';
import { SorLaborService } from '../service/sor-labor.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateSorLaborsDto, UpdateSorLaborsDto } from '../dto/sor-labors.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

const options: ExtraCrudOptions = {
  entityIdName: 'itemId',
  createDto: CreateSorLaborsDto,
  updateDto: UpdateSorLaborsDto,
};

@ApiBearerAuth()
@Controller('sor-labors')
@ApiTags('Sor Labors Controller')
export class SorLaborController extends ExtraCrudController<SorLabor>(options) {
  constructor(private readonly sorLaborService: SorLaborService) {
    super(sorLaborService);
  }
}
