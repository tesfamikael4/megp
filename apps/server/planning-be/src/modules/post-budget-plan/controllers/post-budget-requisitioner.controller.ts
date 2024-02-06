import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
import { ExtraCrudController } from 'src/shared/controller';
import { PostBudgetRequisitioner } from 'src/entities/post-budget-plan-requisitioner.entity';
import { PostBudgetRequisitionerService } from '../services/post-budget-requisitioner.service';
import { CurrentUser } from 'src/shared/authorization';

const options: ExtraCrudOptions = {
  entityIdName: 'postBudgetPlanActivityId',
};

@Controller('post-budget-requisitioner')
@ApiTags('post-budget-requisitioner')
export class PostBudgetRequisitionerController extends ExtraCrudController<PostBudgetRequisitioner>(
  options,
) {
  constructor(
    private readonly postBudgetRequisitionerService: PostBudgetRequisitionerService,
  ) {
    super(postBudgetRequisitionerService);
  }

  @Post('bulk-create')
  async bulkCreate(
    @Body() requisitioner: any,
    @CurrentUser() user: any,
  ): Promise<any> {
    return this.postBudgetRequisitionerService.bulkCreate(
      requisitioner,
      user.organization.id,
    );
  }
}
