import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { PostBudgetPlanDisbursement } from 'src/entities';
import { PostBudgetPlanDisbursementService } from '../services/post-budget-plan-disbursement.service';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';

const options: ExtraCrudOptions = {
  entityIdName: 'postBudgetPlanActivityId',
};

@Controller('post-budge-plan-disbursements')
@ApiTags('post-budge-plan-disbursements')
export class PostBudgePlantDisbursementController extends ExtraCrudController<PostBudgetPlanDisbursement>(
  options,
) {
  constructor(
    private readonly postBudgetPlanDisbursementService: PostBudgetPlanDisbursementService,
  ) {
    super(postBudgetPlanDisbursementService);
  }

  @Post('bulk-create')
  async bulkCreate(@Body() itemData: any): Promise<any> {
    return this.postBudgetPlanDisbursementService.bulkCreate(itemData);
  }
}
