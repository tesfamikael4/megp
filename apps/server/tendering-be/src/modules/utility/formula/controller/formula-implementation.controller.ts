import {
  Controller,
  Post,
  Body,
  Param,
  Req,
  Get,
  Delete,
} from '@nestjs/common';
import { ApiBody, ApiParam, ApiTags } from '@nestjs/swagger';
import {
  CreateFormulaImplementationDto,
  CreateUnitPriceDto,
  EvaluateFormulaImplementationDto,
  UpdateFormulaImplementationDto,
} from '../dto/formula-implementation.dto';
import { FormulaImplementationService } from '../service/formula-implementation.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { FormulaImplementation } from 'src/entities/formula-implementation.entity';
import { AllowAnonymous } from 'src/shared/authorization';
import { CompleteFinancialBidderEvaluationDto } from 'src/modules/financial-evaluation/dto/financial-assessment.dto';

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

  @ApiBody({ type: EvaluateFormulaImplementationDto })
  @Post('evaluate/:id')
  async evaluate(
    @Body() evaluateDto: EvaluateFormulaImplementationDto,
    @Param('id') id: string,
  ) {
    return this.formulaImplementationService.evaluate(id, evaluateDto);
  }

  @ApiBody({ type: CreateUnitPriceDto })
  @Post('create-unit-price')
  async createUnitPrice(@Body() itemDto: CreateUnitPriceDto, @Req() req: any) {
    return this.formulaImplementationService.createUnitPrice(itemDto, req);
  }

  @Get('formula-implementation-status/:lotId/:itemId/:bidderId')
  async formulaImplementationStatus(
    @Param('lotId') lotId: string,
    @Param('itemId') itemId: string,
    @Param('bidderId') bidderId: string,
    @Req() req,
  ) {
    return await this.formulaImplementationService.formulaImplementationStatus(
      lotId,
      itemId,
      bidderId,
      req,
    );
  }
  @Get('get-summary/:lotId/:itemId/:bidderId')
  async getSummary(
    @Param('lotId') lotId: string,
    @Param('itemId') itemId: string,
    @Param('bidderId') bidderId: string,
    @Req() req,
  ) {
    return await this.formulaImplementationService.getSummary(
      lotId,
      itemId,
      bidderId,
      req,
    );
  }
  @Post('save-result')
  async saveResult(@Body() itemData: any, @Req() req) {
    return await this.formulaImplementationService.saveResult(
      itemData.lotId,
      itemData.itemId,
      itemData.bidderId,
      req,
    );
  }
  @Post('complete-bidder-evaluation')
  async completeBidderEvaluation(
    @Body() itemData: CompleteFinancialBidderEvaluationDto,
    @Req() req,
  ) {
    return await this.formulaImplementationService.completeBidderEvaluation(
      itemData,
      req,
    );
  }

  @Delete('delete/:id')
  async delete(@Param('id') id: string) {
    return await this.formulaImplementationService.delete(id);
  }
}
