// import { Controller } from '@nestjs/common';
// import { ApiTags } from '@nestjs/swagger';
// import { PostBudgetPlanFrameworkContract } from 'src/entities';
// import { PostBudgetPlanFrameworkContractService } from '../services/post-budget-plan-framework-contract.service';
// import { ExtraCrudOptions } from 'src/shared/types/crud-option.type';
// import { ExtraCrudController } from 'src/shared/controller';

// const options: ExtraCrudOptions = {
//   entityIdName: 'postBudgetPlanActivityId',
// };

// @Controller('post-budget-plan-framework-contracts')
// @ApiTags('post-budget-plan-framework-contracts')
// export class PostBudgetPlanFrameworkContractController extends ExtraCrudController<PostBudgetPlanFrameworkContract>(
//   options,
// ) {
//   constructor(
//     private readonly postBudgetPlanFrameworkContractService: PostBudgetPlanFrameworkContractService,
//   ) {
//     super(postBudgetPlanFrameworkContractService);
//   }
// }
