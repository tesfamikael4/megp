import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { CreateFormulaDto, UpdateFormulaDto } from '../dto/formula.dto';
import { FormulaService } from '../service/formula.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { Formula } from 'src/entities/formula.entity';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  createDto: CreateFormulaDto,
  updateDto: UpdateFormulaDto,
};

@ApiTags('Formula Controller')
@Controller('formulas')
export class FormulaController extends ExtraCrudController<Formula>(options) {
  constructor(private readonly formulaService: FormulaService) {
    super(formulaService);
  }
}
