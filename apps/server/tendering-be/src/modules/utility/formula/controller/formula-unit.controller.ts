import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateFormulaUnitDto,
  EvaluateFormulaUnitDto,
  UpdateFormulaUnitDto,
} from '../dto/formula.dto';
import { FormulaUnitService } from '../service/formula-unit.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { FormulaUnit } from 'src/entities/formula-unit.entity';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  createDto: CreateFormulaUnitDto,
  updateDto: UpdateFormulaUnitDto,
};

@ApiTags('Formula Unit Controller')
@Controller('formula-units')
export class FormulaUnitController extends ExtraCrudController<FormulaUnit>(
  options,
) {
  constructor(private readonly formulaUnitService: FormulaUnitService) {
    super(formulaUnitService);
  }

  @ApiParam({ name: 'formulaUnitId', description: 'Formula Unit ID' })
  @ApiBody({ type: EvaluateFormulaUnitDto })
  @Post(':formulaUnitId/evaluate')
  async evaluate(
    @Body() evaluateDto: EvaluateFormulaUnitDto,
    @Param('formulaUnit Id') id: string,
  ) {
    return this.formulaUnitService.evaluate(id, evaluateDto);
  }
}
