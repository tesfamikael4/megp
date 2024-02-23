import { SorFee } from 'src/entities/sor-fee.entity';
import { ExtraCrudController } from 'src/shared/controller';
import { SorFeeService } from '../service/sor-fee.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { CreateSorFeesDto, UpdateSorFeesDto } from '../dto/sor-fee.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Controller } from '@nestjs/common';

const options: ExtraCrudOptions = {
  entityIdName: 'itemId',
  createDto: CreateSorFeesDto,
  updateDto: UpdateSorFeesDto,
};

@ApiBearerAuth()
@Controller('sor-fees')
@ApiTags('Sor Fees Controller')
export class SorFeeController extends ExtraCrudController<SorFee>(options) {
  constructor(private readonly sorFeeService: SorFeeService) {
    super(sorFeeService);
  }
}
