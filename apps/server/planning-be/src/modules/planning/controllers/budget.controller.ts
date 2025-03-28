import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { Budget } from 'src/entities/budget.entity';
import { BudgetService } from '../services/budget.service';
import { ApiPaginatedResponse } from 'src/shared/api-data';
import { CurrentUser } from 'src/shared/authorization';

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
  @ApiBody({})
  async bulkCreate(@Body() budgets: any) {
    return await this.budgetService.bulkCreate(budgets);
  }

  @Get('/summation/:appId')
  async getSummation(@CurrentUser() user: any, @Param('appId') appId: string) {
    return await this.budgetService.getSummation(user.organization.id, appId);
  }
}
