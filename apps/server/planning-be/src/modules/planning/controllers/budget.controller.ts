import { Body, Controller, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { Budget } from 'src/entities/budget.entity';
import { BudgetService } from '../services/budget.service';
import { ApiPaginatedResponse } from 'src/shared/api-data';

const options: ExtraCrudOptions = {
  entityIdName: 'appId',
};

@Controller('budgets')
@ApiTags('budgets')
export class BudgetController extends ExtraCrudController<Budget>(options) {
  constructor(private readonly budgetService: BudgetService) {
    super(budgetService);
  }

  @Post('bulk-create')
  @ApiPaginatedResponse(Budget)
  async bulkCreate(@Body() budgets: any) {
    return await this.budgetService.bulkCreate(budgets);
  }
}
