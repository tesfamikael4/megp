import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { PreBudgetRequisitioner } from 'src/entities/pre-budget-plan-requisitioner.entity';
import { PreBudgetRequisitionerService } from '../services/pre-budget-requisitioner.service';

const options: ExtraCrudOptions = {
  entityIdName: 'preBudgetPlanActivityId',
};

@Controller('pre-budget-requisitioner')
@ApiTags('pre-budget-requisitioner')
export class PreBudgetRequisitionerController extends ExtraCrudController<PreBudgetRequisitioner>(
  options,
) {
  constructor(
    private readonly preBudgetRequisitionerService: PreBudgetRequisitionerService,
  ) {
    super(preBudgetRequisitionerService);
  }

  @Post('bulk-create')
  async bulkCreate(@Body() requisitioner: any, @Req() req?: any): Promise<any> {
    return this.preBudgetRequisitionerService.bulkCreate(requisitioner, req);
  }
}
