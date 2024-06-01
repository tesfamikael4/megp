import { Controller, Post, Body, Param } from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateFormulaImplementationDto,
  EvaluateFormulaImplementationDto,
  UpdateFormulaImplementationDto,
} from '../dto/formula-implementation.dto';
import { FormulaImplementationService } from '../service/formula-implementation.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { FormulaImplementation } from 'src/entities/formula-implementation.entity';

const options: ExtraCrudOptions = {
  entityIdName: 'lotId',
  createDto: CreateFormulaImplementationDto,
  updateDto: UpdateFormulaImplementationDto,
};

@ApiTags('Formula Implementation Controller')
@Controller('formula-implementation')
export class FormulaImplementationController extends ExtraCrudController<FormulaImplementation>(
  options,
) {
  constructor(
    private readonly formulaImplementationService: FormulaImplementationService,
  ) {
    super(formulaImplementationService);
  }

  @ApiParam({ name: 'formulaImplementationId', description: 'Formula Unit ID' })
  @ApiBody({ type: EvaluateFormulaImplementationDto })
  @Post(':formulaImplementationId/evaluate')
  async evaluate(
    @Body() evaluateDto: EvaluateFormulaImplementationDto,
    @Param('formulaImplementation Id') id: string,
  ) {
    return this.formulaImplementationService.evaluate(id, evaluateDto);
  }
}
